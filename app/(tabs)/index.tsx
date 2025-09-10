import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Play, Sparkles, Users, Clock } from "lucide-react-native";
import { useMeditationApp } from "@/hooks/meditation-app-context";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { state, translations } = useMeditationApp();
  const t = translations[state.language];

  const journeyStats = [
    { label: t.totalSessions, value: "47", icon: Play },
    { label: t.hoursMediated, value: "12.5", icon: Clock },
    { label: t.currentStreak, value: "7", icon: Sparkles },
  ];

  const meditationTypes = [
    {
      id: "creative",
      title: t.creative,
      description: t.creativeDesc,
      gradient: ["#667eea", "#764ba2"] as const,
      icon: Sparkles,
    },
    {
      id: "ifeelsahaj",
      title: t.iFeelSahaj,
      description: t.iFeelSahajDesc,
      gradient: ["#f093fb", "#f5576c"] as const,
      icon: Play,
    },
    {
      id: "community",
      title: t.community,
      description: t.communityDesc,
      gradient: ["#4facfe", "#00f2fe"] as const,
      icon: Users,
    },
    {
      id: "history",
      title: t.history,
      description: t.historyDesc,
      gradient: ["#43e97b", "#38f9d7"] as const,
      icon: Clock,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.greeting}>{t.welcome}</Text>
        <Text style={styles.subtitle}>{t.readyToMeditate}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.journeyCard}>
          <Text style={styles.journeyTitle}>{t.yourJourney}</Text>
          <View style={styles.statsContainer}>
            {journeyStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <stat.icon size={20} color="#6366f1" />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t.chooseMeditation}</Text>
        
        <View style={styles.meditationGrid}>
          {meditationTypes.map((type, index) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.meditationCard,
                index % 2 === 0 ? styles.leftCard : styles.rightCard,
              ]}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={type.gradient}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardIconContainer}>
                  <type.icon size={24} color="#ffffff" />
                </View>
                <Text style={styles.cardTitle}>{type.title}</Text>
                <Text style={styles.cardDescription}>{type.description}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.9,
  },
  content: {
    padding: 24,
  },
  journeyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  journeyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
  },
  meditationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  meditationCard: {
    width: (width - 56) / 2,
    height: 160,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  leftCard: {
    marginRight: 8,
  },
  rightCard: {
    marginLeft: 8,
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: "#ffffff",
    opacity: 0.9,
    lineHeight: 16,
  },
});
