import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Settings, Globe, User, Bell, Download, LogOut } from "lucide-react-native";
import { useMeditationApp } from "@/hooks/meditation-app-context";

export default function ProfileScreen() {
  const { state, setLanguage, translations } = useMeditationApp();
  const t = translations[state.language];

  const settingsOptions = [
    {
      id: "notifications",
      title: t.notifications,
      icon: Bell,
      type: "switch",
      value: true,
    },
    {
      id: "downloadOnWifi",
      title: t.downloadOnWifi,
      icon: Download,
      type: "switch",
      value: false,
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
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <User size={32} color="#ffffff" />
          </View>
          <Text style={styles.userName}>Meditation Seeker</Text>
          <Text style={styles.userLevel}>{t.basicLevel}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>{t.language}</Text>
          <View style={styles.languageSelector}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                state.language === "english" && styles.languageOptionActive,
              ]}
              onPress={() => setLanguage("english")}
            >
              <Text
                style={[
                  styles.languageOptionText,
                  state.language === "english" && styles.languageOptionTextActive,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageOption,
                state.language === "italian" && styles.languageOptionActive,
              ]}
              onPress={() => setLanguage("italian")}
            >
              <Text
                style={[
                  styles.languageOptionText,
                  state.language === "italian" && styles.languageOptionTextActive,
                ]}
              >
                Italiano
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>{t.preferences}</Text>
          {settingsOptions.map((option) => (
            <View key={option.id} style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIconContainer}>
                  <option.icon size={20} color="#6366f1" />
                </View>
                <Text style={styles.settingTitle}>{option.title}</Text>
              </View>
              {option.type === "switch" && (
                <Switch
                  value={option.value}
                  trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
                  thumbColor="#ffffff"
                />
              )}
            </View>
          ))}
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>{t.account}</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Settings size={20} color="#6366f1" />
              </View>
              <Text style={styles.settingTitle}>{t.accountSettings}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIconContainer, styles.logoutIcon]}>
                <LogOut size={20} color="#ef4444" />
              </View>
              <Text style={[styles.settingTitle, styles.logoutText]}>{t.signOut}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.levelCard}>
          <Text style={styles.levelTitle}>{t.meditationLevel}</Text>
          <Text style={styles.levelDescription}>{t.levelDescription}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={[styles.progressFill, { width: "60%" }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={styles.progressText}>60% {t.toIntermediate}</Text>
          </View>
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
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.9,
  },
  content: {
    padding: 24,
  },
  settingsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  languageSelector: {
    flexDirection: "row",
    gap: 8,
  },
  languageOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  languageOptionActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  languageOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  languageOptionTextActive: {
    color: "#ffffff",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoutIcon: {
    backgroundColor: "#fef2f2",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  logoutText: {
    color: "#ef4444",
  },
  levelCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  levelDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
});
