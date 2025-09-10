import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Play, Clock, Calendar } from "lucide-react-native";
import { useMeditationApp } from "@/hooks/meditation-app-context";

export default function HistoryScreen() {
  const { state, translations } = useMeditationApp();
  const t = translations[state.language];

  const mockHistory = [
    {
      id: "1",
      date: "2025-01-02",
      duration: 15,
      type: "Creative",
      completed: true,
      rating: 5,
    },
    {
      id: "2",
      date: "2025-01-01",
      duration: 20,
      type: "I Feel Sahaj",
      completed: true,
      rating: 4,
    },
    {
      id: "3",
      date: "2024-12-31",
      duration: 10,
      type: "Community",
      completed: false,
      rating: null,
    },
    {
      id: "4",
      date: "2024-12-30",
      duration: 25,
      type: "Creative",
      completed: true,
      rating: 5,
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(state.language === "italian" ? "it-IT" : "en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Creative":
        return ["#667eea", "#764ba2"] as const;
      case "I Feel Sahaj":
        return ["#f093fb", "#f5576c"] as const;
      case "Community":
        return ["#4facfe", "#00f2fe"] as const;
      default:
        return ["#43e97b", "#38f9d7"] as const;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>{t.meditationHistory}</Text>
        <Text style={styles.subtitle}>{t.trackProgress}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statLabel}>{t.totalSessions}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12.5h</Text>
            <Text style={styles.statLabel}>{t.totalTime}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>{t.avgRating}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t.recentSessions}</Text>

        {mockHistory.map((session) => (
          <TouchableOpacity key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <LinearGradient
                colors={getTypeColor(session.type)}
                style={styles.sessionIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Play size={16} color="#ffffff" />
              </LinearGradient>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionType}>{session.type}</Text>
                <View style={styles.sessionMeta}>
                  <Calendar size={12} color="#6b7280" />
                  <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
                  <Clock size={12} color="#6b7280" />
                  <Text style={styles.sessionDuration}>{session.duration}m</Text>
                </View>
              </View>
              <View style={styles.sessionStatus}>
                {session.completed ? (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>{t.completed}</Text>
                  </View>
                ) : (
                  <View style={styles.incompleteBadge}>
                    <Text style={styles.incompleteText}>{t.incomplete}</Text>
                  </View>
                )}
              </View>
            </View>
            {session.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>
                  {"★".repeat(session.rating)}{"☆".repeat(5 - session.rating)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
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
  title: {
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
  statsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    flexDirection: "row",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    alignItems: "center",
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
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
  },
  sessionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  sessionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sessionDate: {
    fontSize: 12,
    color: "#6b7280",
    marginRight: 8,
  },
  sessionDuration: {
    fontSize: 12,
    color: "#6b7280",
  },
  sessionStatus: {
    alignItems: "flex-end",
  },
  completedBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#16a34a",
  },
  incompleteBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  incompleteText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#d97706",
  },
  ratingContainer: {
    marginTop: 8,
    alignItems: "flex-start",
  },
  ratingText: {
    fontSize: 14,
    color: "#fbbf24",
  },
});
