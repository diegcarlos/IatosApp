import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/Header";
import { getHistory } from "../services/storage";
import { colors, shadows, spacing, typography } from "../theme";

interface Simulation {
  id: string;
  before: string;
  after: string;
  date: string;
}

export default function History() {
  const router = useRouter();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    try {
      const data = await getHistory();
      setSimulations(data);
    } catch (error) {
      console.error("Erro ao carregar simulações:", error);
      Alert.alert("Erro", "Não foi possível carregar o histórico.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderSimulation = ({ item }: { item: Simulation }) => (
    <TouchableOpacity
      style={styles.simulationCard}
      onPress={() =>
        router.push({
          pathname: "/result",
          params: {
            beforeAfterImages: JSON.stringify({
              before: item.before,
              after: item.after,
            }),
          },
        })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.primary.main}
        />
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Text style={styles.imageLabel}>Antes</Text>
          <Image
            source={{ uri: item.before }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.imageWrapper}>
          <Text style={styles.imageLabel}>Depois</Text>
          <Image
            source={{ uri: item.after }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Histórico" showLogo={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Histórico" showLogo={true} />
      {simulations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="images-outline"
            size={64}
            color={colors.text.disabled}
          />
          <Text style={styles.emptyText}>
            Nenhuma simulação encontrada no histórico
          </Text>
        </View>
      ) : (
        <FlatList
          data={simulations}
          renderItem={renderSimulation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: spacing.lg,
    fontFamily: typography.fontFamily.medium,
  },
  listContainer: {
    padding: spacing.lg,
  },
  simulationCard: {
    backgroundColor: colors.background.paper,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  dateText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.medium,
  },
  imageContainer: {
    flexDirection: "row",
    height: 180,
  },
  imageWrapper: {
    flex: 1,
    position: "relative",
  },
  divider: {
    width: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  imageLabel: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.medium,
    zIndex: 1,
    ...shadows.sm,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
