import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import { colors, typography } from "../theme";

export default function Page() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Transplante Capilar IA" showLogo={true} />

      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Visualize seu novo visual</Text>
          <Text style={styles.heroSubtitle}>
            Simule resultados de transplante capilar com tecnologia de
            inteligência artificial
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <View style={styles.beforeAfterContainer}>
            <View style={styles.imageCard}>
              <Text style={styles.imageLabel}>Antes</Text>
              <View style={styles.imagePlaceholder}>
                <Ionicons
                  name="person"
                  size={40}
                  color={colors.text.disabled}
                />
              </View>
            </View>

            <Ionicons
              name="arrow-forward"
              size={24}
              color={colors.primary.main}
              style={styles.arrowIcon}
            />

            <View style={styles.imageCard}>
              <Text style={styles.imageLabel}>Depois</Text>
              <View style={styles.imagePlaceholder}>
                <Ionicons
                  name="person"
                  size={40}
                  color={colors.text.disabled}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Iniciar Simulação"
          onPress={() => router.push("/capture")}
          icon="camera-outline"
          primary={true}
        />
        <CustomButton
          title="Ver Histórico"
          onPress={() => router.push("/history")}
          icon="time-outline"
          primary={false}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Sanabria - Tecnologia avançada em transplante capilar
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  heroSection: {
    padding: 20,
    paddingTop: 30,
  },
  heroContent: {
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  beforeAfterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  imageCard: {
    width: 120,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.background.paper,
  },
  imageLabel: {
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  imagePlaceholder: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  arrowIcon: {
    marginHorizontal: 15,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.regular,
  },
});
