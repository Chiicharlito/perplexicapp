import React from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const SkeletonLoader = () => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.9],
  });

  const Line = () => (
    <Animated.View
      style={[
        styles.line,
        {
          opacity,
        },
      ]}
    />
  );

  const ShortLine = () => (
    <Animated.View
      style={[
        styles.shortLine,
        {
          opacity,
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <Line />
      <Line />
      <ShortLine />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  line: {
    height: 10,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    // width: width - 32, // Largeur totale moins le padding
  },
  shortLine: {
    height: 10,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    // width: width - 200, // Largeur totale moins le padding
  },
});

export default SkeletonLoader;
