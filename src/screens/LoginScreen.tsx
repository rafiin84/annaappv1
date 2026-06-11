import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";

const ANNAMALAI_PHOTO =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/K._Annamalai_at_padayatra.jpg/250px-K._Annamalai_at_padayatra.jpg";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (phone.trim().length < 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    if (password.trim().length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    setLoading(true);
    const ok = await login(phone, password);
    setLoading(false);
    if (!ok) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.logoRow}>
            <View style={styles.logoCircle}>
              <Image source={{ uri: ANNAMALAI_PHOTO }} style={styles.heroImage} />
            </View>
          </View>
          <Text style={styles.appName}>Anna</Text>
          <Text style={styles.tagline}>ஒன்றாய் இணைவோம் • Together We Rise</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSub}>Sign in to continue</Text>

          {/* Phone */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={[styles.inputRow, error && phone.trim().length < 10 ? styles.inputError : null]}>
              <Text style={styles.prefix}>+91</Text>
              <View style={styles.divider} />
              <TextInput
                style={styles.input}
                placeholder="10-digit mobile number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={(t) => { setPhone(t); setError(""); }}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputRow, error && password.trim().length < 4 ? styles.inputError : null]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(t) => { setPassword(t); setError(""); }}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                <Text style={styles.eyeText}>{showPassword ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Error */}
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          {/* Forgot */}
          <TouchableOpacity style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          {/* OTP Option */}
          <TouchableOpacity style={styles.otpBtn} activeOpacity={0.8}>
            <Text style={styles.otpBtnText}>Login with OTP</Text>
          </TouchableOpacity>
        </View>

        {/* Register */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>New to Anna? </Text>
          <TouchableOpacity>
            <Text style={styles.registerLink}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#2563EB" },
  scroll: { flexGrow: 1, backgroundColor: "#2563EB" },

  // Hero
  hero: { alignItems: "center", paddingTop: 32, paddingBottom: 36 },
  logoRow: { marginBottom: 16 },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "#EAB308",
    overflow: "hidden",
    backgroundColor: "#1e40af",
  },
  heroImage: { width: "100%", height: "100%" },
  appName: {
    fontSize: 38,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 24,
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    flex: 1,
    minHeight: 460,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 28,
  },

  // Fields
  fieldWrap: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    height: 52,
  },
  inputError: { borderColor: "#EF4444" },
  prefix: { fontSize: 15, color: "#374151", fontWeight: "600" },
  divider: { width: 1, height: 22, backgroundColor: "#E5E7EB", marginHorizontal: 10 },
  input: { flex: 1, fontSize: 15, color: "#111827" },
  eyeBtn: { paddingLeft: 8 },
  eyeText: { fontSize: 13, color: "#2563EB", fontWeight: "600" },

  // Error
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginBottom: 8,
    marginTop: -8,
  },

  // Forgot
  forgotRow: { alignItems: "flex-end", marginBottom: 24, marginTop: 4 },
  forgotText: { fontSize: 13, color: "#2563EB", fontWeight: "600" },

  // Login button
  loginBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },

  // OR
  orRow: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  orLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  orText: { marginHorizontal: 12, fontSize: 12, color: "#9CA3AF", fontWeight: "600" },

  // OTP button
  otpBtn: {
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#EAB308",
    backgroundColor: "#FEFCE8",
  },
  otpBtnText: { color: "#92400E", fontSize: 15, fontWeight: "700" },

  // Register
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
  },
  registerText: { fontSize: 14, color: "#6B7280" },
  registerLink: { fontSize: 14, color: "#2563EB", fontWeight: "700" },
});
