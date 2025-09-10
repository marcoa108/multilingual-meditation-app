import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Play, ChevronDown, ChevronUp } from "lucide-react-native";
import { useMeditationApp } from "@/hooks/meditation-app-context";

export default function MeditateScreen() {
  const { state, updateMeditationParams, translations } = useMeditationApp();
  const t = translations[state.language];
  const [showAdvanced, setShowAdvanced] = useState(false);

  const durations = [5, 10, 15, 20, 30, 45, 60];
  const voices = [
    { id: "marco", name: "Marco", gender: "male" },
    { id: "soma", name: "Soma", gender: "female" },
    { id: "random", name: t.randomVoice, gender: "any" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>{t.createMeditation}</Text>
        <Text style={styles.subtitle}>{t.customizeExperience}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.parameterCard}>
          <Text style={styles.cardTitle}>{t.basicParameters}</Text>
          
          <View style={styles.parameterGroup}>
            <Text style={styles.parameterLabel}>{t.duration}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.durationContainer}>
                {durations.map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.durationButton,
                      state.meditationParams.duration === duration &&
                        styles.durationButtonActive,
                    ]}
                    onPress={() =>
                      updateMeditationParams({ duration })
                    }
                  >
                    <Text
                      style={[
                        styles.durationText,
                        state.meditationParams.duration === duration &&
                          styles.durationTextActive,
                      ]}
                    >
                      {duration}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.parameterGroup}>
            <Text style={styles.parameterLabel}>{t.language}</Text>
            <View style={styles.languageContainer}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  state.meditationParams.language === "english" &&
                    styles.languageButtonActive,
                ]}
                onPress={() =>
                  updateMeditationParams({ language: "english" })
                }
              >
                <Text
                  style={[
                    styles.languageText,
                    state.meditationParams.language === "english" &&
                      styles.languageTextActive,
                  ]}
                >
                  English
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  state.meditationParams.language === "italian" &&
                    styles.languageButtonActive,
                ]}
                onPress={() =>
                  updateMeditationParams({ language: "italian" })
                }
              >
                <Text
                  style={[
                    styles.languageText,
                    state.meditationParams.language === "italian" &&
                      styles.languageTextActive,
                  ]}
                >
                  Italiano
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.parameterGroup}>
            <Text style={styles.parameterLabel}>{t.voice}</Text>
            <View style={styles.voiceContainer}>
              {voices.map((voice) => (
                <TouchableOpacity
                  key={voice.id}
                  style={[
                    styles.voiceButton,
                    state.meditationParams.voice === voice.id &&
                      styles.voiceButtonActive,
                  ]}
                  onPress={() =>
                    updateMeditationParams({ voice: voice.id })
                  }
                >
                  <Text
                    style={[
                      styles.voiceText,
                      state.meditationParams.voice === voice.id &&
                        styles.voiceTextActive,
                    ]}
                  >
                    {voice.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.parameterLabel}>{t.backgroundMusic}</Text>
            <Switch
              value={state.meditationParams.backgroundMusic}
              onValueChange={(value) =>
                updateMeditationParams({ backgroundMusic: value })
              }
              trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={styles.advancedToggleText}>{t.advancedParameters}</Text>
          {showAdvanced ? (
            <ChevronUp size={20} color="#6366f1" />
          ) : (
            <ChevronDown size={20} color="#6366f1" />
          )}
        </TouchableOpacity>

        {showAdvanced && (
          <View style={styles.parameterCard}>
            <View style={styles.switchGroup}>
              <Text style={styles.parameterLabel}>{t.showImages}</Text>
              <Switch
                value={state.meditationParams.showImages}
                onValueChange={(value) =>
                  updateMeditationParams({ showImages: value })
                }
                trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.switchGroup}>
              <Text style={styles.parameterLabel}>{t.showSubtitles}</Text>
              <Switch
                value={state.meditationParams.showSubtitles}
                onValueChange={(value) =>
                  updateMeditationParams({ showSubtitles: value })
                }
                trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.switchGroup}>
              <Text style={styles.parameterLabel}>{t.includeMantrasSanskrit}</Text>
              <Switch
                value={state.meditationParams.includeMantrasSanskrit}
                onValueChange={(value) =>
                  updateMeditationParams({ includeMantrasSanskrit: value })
                }
                trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.startButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Play size={24} color="#ffffff" />
            <Text style={styles.startButtonText}>{t.startMeditation}</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  parameterCard: {
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 24,
  },
  parameterGroup: {
    marginBottom: 24,
  },
  parameterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  durationContainer: {
    flexDirection: "row",
    gap: 8,
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  durationButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  durationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  durationTextActive: {
    color: "#ffffff",
  },
  languageContainer: {
    flexDirection: "row",
    gap: 8,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  languageButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  languageText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  languageTextActive: {
    color: "#ffffff",
  },
  voiceContainer: {
    flexDirection: "row",
    gap: 8,
  },
  voiceButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  voiceButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  voiceText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  voiceTextActive: {
    color: "#ffffff",
  },
  switchGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  advancedToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
  },
  advancedToggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
  },
  startButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: "hidden",
  },
  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
