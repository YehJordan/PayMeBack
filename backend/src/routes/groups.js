import express from 'express';
import { verifySupabaseToken } from '../middleware/auth.js';
import sql from '../db/credentials.js';

const router = express.Router();

// Create a group
router.post('/', verifySupabaseToken, async (req, res) => {
  const { name, description, budget } = req.body;
  const userId = req.user.sub;

  if (!name) {
    return res.status(400).json({ error: 'Group name is required' });
  }

  const parsedBudget = budget ? Number(budget) : 0;

  try {
    const result = await sql.begin(async (sqlTransaction) => {
      // 1. Create the group
      const [newGroup] = await sqlTransaction`
        INSERT INTO groups (name, description, budget, creator_id)
        VALUES (${name}, ${description || null}, ${parsedBudget}, ${userId})
        RETURNING *
      `;

      // 2. Add the creator to group_members
      await sqlTransaction`
        INSERT INTO group_members (group_id, user_id)
        VALUES (${newGroup.id}, ${userId})
      `;

      return newGroup;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group. Database error.' });
  }
});

// Get all groups for the authenticated user
router.get('/', verifySupabaseToken, async (req, res) => {
  const userId = req.user.sub;
  try {
    const groups = await sql`
      SELECT g.*
      FROM groups g
      JOIN group_members gm ON g.id = gm.group_id
      WHERE gm.user_id = ${userId}
      ORDER BY g.id DESC
    `;
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Get group by ID
router.get('/:id', verifySupabaseToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.sub;
  
  try {
    const [group] = await sql`
      SELECT g.*
      FROM groups g
      JOIN group_members gm ON g.id = gm.group_id
      WHERE g.id = ${id} AND gm.user_id = ${userId}
    `;
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found or unauthorized' });
    }
    
    // Get total expenses for the group to calculate budget progress
    const [stats] = await sql`
      SELECT COALESCE(SUM(amount), 0) as total_expenses
      FROM expenses
      WHERE group_id = ${id}
    `;
    
    res.json({ ...group, total_expenses: stats.total_expenses });
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

// Get group members
router.get('/:id/members', verifySupabaseToken, async (req, res) => {
  const { id } = req.params;
  try {
    const members = await sql`
      SELECT u.id, u.email, u.name, 
             -- Fallback: if creator_id is not set, the first member added (lowest gm.id) is considered the owner
             CASE 
               WHEN g.creator_id IS NOT NULL THEN (u.id = g.creator_id)
               ELSE (gm.id = (SELECT MIN(id) FROM group_members WHERE group_id = ${id}))
             END as is_owner
      FROM users u
      JOIN group_members gm ON u.id = gm.user_id
      JOIN groups g ON g.id = gm.group_id
      WHERE gm.group_id = ${id}
      ORDER BY gm.id ASC
    `;
    res.json(members);
  } catch (error) {
    console.error('Error fetching group members:', error);
    res.status(500).json({ error: 'Failed to fetch group members' });
  }
});

// Add a member to a group
router.post('/:id/members', verifySupabaseToken, async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const userId = req.user.sub;

  if (!email) {
    return res.status(400).json({ error: 'Email is required to add a member' });
  }

  try {
    // Check if the current user is a member of the group
    const [membership] = await sql`
      SELECT 1 FROM group_members WHERE group_id = ${id} AND user_id = ${userId}
    `;

    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }

    // Find the user by email
    const [userToAdd] = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (!userToAdd) {
      return res.status(404).json({ error: 'User with this email not found' });
    }

    // Check if the user is already a member
    const [existingMember] = await sql`
      SELECT 1 FROM group_members WHERE group_id = ${id} AND user_id = ${userToAdd.id}
    `;

    if (existingMember) {
      return res.status(400).json({ error: 'User is already a member of this group' });
    }

    // Add user to the group
    await sql`
      INSERT INTO group_members (group_id, user_id)
      VALUES (${id}, ${userToAdd.id})
    `;

    res.status(201).json({ message: 'Member added successfully', userId: userToAdd.id });
  } catch (error) {
    console.error('Error adding group member:', error);
    res.status(500).json({ error: 'Failed to add member to group' });
  }
});

// Remove a member from a group
router.delete('/:id/members/:memberId', verifySupabaseToken, async (req, res) => {
  const { id, memberId } = req.params;
  const userId = req.user.sub;

  try {
    // 1. Verify the current user is the owner of the group
    const [group] = await sql`
      SELECT creator_id FROM groups WHERE id = ${id}
    `;

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Fallback: if creator_id is null, find the earliest added member
    let isOwner = false;
    if (group.creator_id) {
      isOwner = group.creator_id === userId;
    } else {
      const [firstMember] = await sql`
        SELECT user_id FROM group_members WHERE group_id = ${id} ORDER BY id ASC LIMIT 1
      `;
      isOwner = firstMember && firstMember.user_id === userId;
    }

    // Also allow the member themselves to leave the group
    if (!isOwner && userId !== memberId) {
      return res.status(403).json({ error: 'Only the group owner can remove members' });
    }

    // Prevent removing the owner
    let targetIsOwner = false;
    if (group.creator_id) {
      targetIsOwner = group.creator_id === memberId;
    } else {
      const [firstMember] = await sql`
        SELECT user_id FROM group_members WHERE group_id = ${id} ORDER BY id ASC LIMIT 1
      `;
      targetIsOwner = firstMember && firstMember.user_id === memberId;
    }

    if (targetIsOwner) {
      return res.status(400).json({ error: 'Cannot remove the owner of the group' });
    }

    // Use a transaction since we are performing multiple deletes
    await sql.begin(async (sqlTransaction) => {
      // 2. Remove member's expense contributions (splits) in this group
      await sqlTransaction`
        DELETE FROM expense_contributions
        WHERE user_id = ${memberId} AND expense_id IN (
          SELECT id FROM expenses WHERE group_id = ${id}
        )
      `;

      // 3. Remove expenses created by this member in this group
      // This will cascade and remove associated contributions if the schema is setup with ON DELETE CASCADE
      await sqlTransaction`
        DELETE FROM expenses
        WHERE creator_id = ${memberId} AND group_id = ${id}
      `;

      // 4. Finally, remove the user from the group
      await sqlTransaction`
        DELETE FROM group_members 
        WHERE group_id = ${id} AND user_id = ${memberId}
      `;
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing group member:', error);
    res.status(500).json({ error: 'Failed to remove member from group' });
  }
});

// Get group expenses
router.get('/:id/expenses', verifySupabaseToken, async (req, res) => {
  const { id } = req.params;
  try {
    const expenses = await sql`
      SELECT e.*, u.name as creator_name, u.email as creator_email
      FROM expenses e
      JOIN users u ON e.creator_id = u.id
      WHERE e.group_id = ${id}
      ORDER BY e.date DESC
    `;
    
    // Fetch splits for each expense
    for (let exp of expenses) {
      const splits = await sql`
        SELECT ec.user_id, ec.amount, u.name 
        FROM expense_contributions ec
        JOIN users u ON ec.user_id = u.id
        WHERE ec.expense_id = ${exp.id}
      `;
      exp.splits = splits;
    }

    res.json(expenses);
  } catch (error) {
    console.error('Error fetching group expenses:', error);
    res.status(500).json({ error: 'Failed to fetch group expenses' });
  }
});

// Get group balances
router.get('/:id/balances', verifySupabaseToken, async (req, res) => {
  const { id } = req.params;
  try {
    const balances = await sql`
      SELECT 
        u.id as "userId",
        u.name,
        COALESCE(paid.total_paid, 0) - COALESCE(owed.total_owed, 0) as balance
      FROM group_members gm
      JOIN users u ON gm.user_id = u.id
      LEFT JOIN (
        SELECT creator_id, SUM(amount) as total_paid
        FROM expenses 
        WHERE group_id = ${id}
        GROUP BY creator_id
      ) paid ON u.id = paid.creator_id
      LEFT JOIN (
        SELECT ec.user_id, SUM(ec.amount) as total_owed
        FROM expense_contributions ec
        JOIN expenses e ON ec.expense_id = e.id
        WHERE e.group_id = ${id}
        GROUP BY ec.user_id
      ) owed ON u.id = owed.user_id
      WHERE gm.group_id = ${id}
      ORDER BY balance DESC
    `;
    
    res.json(balances);
  } catch (error) {
    console.error('Error fetching balances:', error);
    res.status(500).json({ error: 'Failed to fetch balances' });
  }
});

// Add an expense to a group
router.post('/:id/expenses', verifySupabaseToken, async (req, res) => {
  const { id } = req.params;
  const { amount, description, category, splits } = req.body;
  const userId = req.user.sub;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'A valid amount is required' });
  }

  try {
    // Check if the user is a member of the group
    const [membership] = await sql`
      SELECT 1 FROM group_members WHERE group_id = ${id} AND user_id = ${userId}
    `;

    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }

    const result = await sql.begin(async (sqlTransaction) => {
      // 1. Create the expense
      const [newExpense] = await sqlTransaction`
        INSERT INTO expenses (group_id, creator_id, amount, description, category)
        VALUES (${id}, ${userId}, ${amount}, ${description || 'Expense'}, ${category || 'Other'})
        RETURNING *
      `;

      // 2. Add contributions if provided
      if (splits && Array.isArray(splits) && splits.length > 0) {
        // splits should be an array of objects: { userId, amount }
        for (const split of splits) {
          if (split.amount && split.amount > 0) {
            await sqlTransaction`
              INSERT INTO expense_contributions (expense_id, user_id, amount)
              VALUES (${newExpense.id}, ${split.userId}, ${split.amount})
            `;
          }
        }
      } else {
        // If no splits are provided, maybe just fully attribute to the creator for now,
        // or leave it as general expense without recorded contributions.
        await sqlTransaction`
          INSERT INTO expense_contributions (expense_id, user_id, amount)
          VALUES (${newExpense.id}, ${userId}, ${amount})
        `;
      }

      return newExpense;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Failed to add expense. Database error.' });
  }
});

// Update an expense (category, splits, payer, amount, description)
router.put('/:id/expenses/:expenseId', verifySupabaseToken, async (req, res) => {
  const { id, expenseId } = req.params;
  const { splits, category, payerId, amount, description } = req.body; 
  const userId = req.user.sub;

  try {
    // Basic auth check: verify user is in group
    const [membership] = await sql`
      SELECT 1 FROM group_members WHERE group_id = ${id} AND user_id = ${userId}
    `;

    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }

    // Verify expense belongs to this group
    const [expense] = await sql`
      SELECT amount FROM expenses WHERE id = ${expenseId} AND group_id = ${id}
    `;

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found in this group' });
    }

    // Verify payer is in the group if payerId is provided
    if (payerId) {
      const [payerMembership] = await sql`
        SELECT 1 FROM group_members WHERE group_id = ${id} AND user_id = ${payerId}
      `;
      if (!payerMembership) {
        return res.status(400).json({ error: 'Payer must be a member of the group' });
      }
    }

    await sql.begin(async (sqlTransaction) => {
      // Update expense fields if provided
      const updateFields = {};
      if (category) updateFields.category = category;
      if (payerId) updateFields.creator_id = payerId;
      if (amount !== undefined) updateFields.amount = amount;
      if (description !== undefined) updateFields.description = description;

      if (Object.keys(updateFields).length > 0) {
        await sqlTransaction`
          UPDATE expenses SET ${sqlTransaction(updateFields)} WHERE id = ${expenseId}
        `;
      }

      // Update splits if provided
      if (splits && Array.isArray(splits)) {
        // Clear existing splits
        await sqlTransaction`DELETE FROM expense_contributions WHERE expense_id = ${expenseId}`;

        // Insert new splits
        for (const split of splits) {
          if (split.amount && split.amount > 0) {
            await sqlTransaction`
              INSERT INTO expense_contributions (expense_id, user_id, amount)
              VALUES (${expenseId}, ${split.userId}, ${split.amount})
            `;
          }
        }
      }
    });

    res.json({ message: 'Expense updated successfully' });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

export default router;
