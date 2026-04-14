import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";

type Props = {
  visible: boolean;
  onClose: () => void;
  activeChartIndex: number;
  setActiveChartIndex: (index: number) => void;
  getCategoryData: () => any[];
  getMemberData: () => any[];
  hasExpenses: boolean;
};

export default function ChartsModal({
  visible,
  onClose,
  activeChartIndex,
  setActiveChartIndex,
  getCategoryData,
  getMemberData,
  hasExpenses,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{ backgroundColor: "#fff", padding: 24, borderRadius: 16 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              Budget Insights
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>
          <Text
            style={{ color: "#6B7280", marginBottom: 16, textAlign: "center" }}
          >
            Swipe right to see more
          </Text>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const slideSize = event.nativeEvent.layoutMeasurement.width;
              const index = event.nativeEvent.contentOffset.x / slideSize;
              setActiveChartIndex(Math.round(index));
            }}
            scrollEventThrottle={16}
          >
            <View
              style={{
                width: Dimensions.get("window").width - 88,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}
              >
                Expenses by Category
              </Text>
              {hasExpenses ? (
                <PieChart
                  data={getCategoryData()}
                  width={Dimensions.get("window").width - 88}
                  height={220}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor={"amount"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                  center={[0, 0]}
                  absolute={false}
                />
              ) : (
                <Text style={{ marginTop: 50, color: "#9ca3af" }}>
                  No expenses yet
                </Text>
              )}
            </View>

            <View
              style={{
                width: Dimensions.get("window").width - 88,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}
              >
                Amount Paid by Members
              </Text>
              {hasExpenses ? (
                <PieChart
                  data={getMemberData()}
                  width={Dimensions.get("window").width - 88}
                  height={220}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor={"amount"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                  center={[0, 0]}
                  absolute={false}
                />
              ) : (
                <Text style={{ marginTop: 50, color: "#9ca3af" }}>
                  No expenses yet
                </Text>
              )}
            </View>
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 16,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: activeChartIndex === 0 ? "#0A7EA4" : "#E5E7EB",
                marginHorizontal: 4,
              }}
            />
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: activeChartIndex === 1 ? "#0A7EA4" : "#E5E7EB",
                marginHorizontal: 4,
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
