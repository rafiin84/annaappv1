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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";

const ANNAMALAI_PHOTO =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/K._Annamalai_at_padayatra.jpg/250px-K._Annamalai_at_padayatra.jpg";

// Simple Zoho Z logo in SVG-free form
function ZohoLogo() {
  return (
    <View style={styles.zohoLogo}>
      <Text style={styles.zohoLogoText}>Z</Text>
    </View>
  );
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { loginDemo, loginWithZoho, isLoading, authError } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDemoLogin = async () => {
    setError("");
    if (phone.trim().length < 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    if (password.trim().length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    setLocalLoading(true);
    const ok = await loginDemo(phone, password);
    setLocalLoading(false);
    if (!ok) setError("Invalid credentials. Please try again.");
  };

  const handleZohoLogin = async () => {
    setError("");
    await loginWithZoho();
  };

  const busy = localLoading || isLoading;
  const displayError = error || authError;

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
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Image source={{ uri: ANNAMALAI_PHOTO }} style={styles.heroImage} />
          </View>
          <Text style={styles.appName}>Anna</Text>
          <Text style={styles.tagline}>ஒன்றாய் இணைவோம் • Together We Rise</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSub}>Sign in to continue</Text>

          {/* Zoho Login — primary */}
          <TouchableOpacity
            style={[styles.zohoBtn, busy && styles.btnDisabled]}
            onPress={handleZohoLogin}
            activeOpacity={0.85}
            disabled={busy}
          >
            {busy && !localLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <ZohoLogo />
                <Text style={styles.zohoBtnText}>Continue with Zoho</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          {/* Phone */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputRow}>
              <Text style={styles.prefix}>+91</Text>
              <View style={styles.dividerV} />
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
            <View style={styles.inputRow}>
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
          {!!displayError && <Text style={styles.errorText}>{displayError}</Text>}

          {/* Forgot */}
          <TouchableOpacity style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In button */}
          <TouchableOpacity
            style={[styles.loginBtn, busy && styles.btnDisabled]}
            onPress={handleDemoLogin}
            activeOpacity={0.85}
            disabled={busy}
          >
            {localLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
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

  hero: { alignItems: "center", paddingTop: 32, paddingBottom: 36 },
  logoCircle: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 3, borderColor: "#EAB308",
    overflow: "hidden", backgroundColor: "#1e40af",
    marginBottom: 16,
  },
  heroImage: { width: "100%", height: "100%" },
  appName: { fontSize: 38, fontWeight: "800", color: "#FFFFFF", letterSpacing: 2 },
  tagline: { fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 6, textAlign: "center", paddingHorizontal: 24 },

  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16,
    flex: 1, minHeight: 480,
  },
  cardTitle: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 4 },
  cardSub: { fontSize: 14, color: "#6B7280", marginBottom: 24 },

  // Zoho button
  zohoBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#E5272A",
    borderRadius: 14, height: 54, gap: 10,
    shadowColor: "#E5272A", shadowOpacity: 0.3, shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
    marginBottom: 4,
  },
  btnDisabled: { opacity: 0.65 },
  zohoLogo: {
    width: 28, height: 28, borderRadius: 6,
    backgroundColor: "#fff", alignItems: "center", justifyContent: "center",
  },
  zohoLogoText: { fontSize: 16, fontWeight: "900", color: "#E5272A" },
  zohoBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // OR divider
  orRow: { flexDirection: "row", alignItems: "center", marginVertical: 18 },
  orLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  orText: { marginHorizontal: 12, fontSize: 12, color: "#9CA3AF", fontWeight: "600" },

  // Fields
  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderColor: "#E5E7EB",
    borderRadius: 12, backgroundColor: "#F9FAFB",
    paddingHorizontal: 14, height: 52,
  },
  prefix: { fontSize: 15, color: "#374151", fontWeight: "600" },
  dividerV: { width: 1, height: 22, backgroundColor: "#E5E7EB", marginHorizontal: 10 },
  input: { flex: 1, fontSize: 15, color: "#111827" },
  eyeBtn: { paddingLeft: 8 },
  eyeText: { fontSize: 13, color: "#2563EB", fontWeight: "600" },

  errorText: { color: "#EF4444", fontSize: 13, marginBottom: 8, marginTop: -8 },

  forgotRow: { alignItems: "flex-end", marginBottom: 24, marginTop: 4 },
  forgotText: { fontSize: 13, color: "#2563EB", fontWeight: "600" },

  loginBtn: {
    backgroundColor: "#2563EB", borderRadius: 14, height: 54,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#2563EB", shadowOpacity: 0.3, shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  loginBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },

  registerRow: {
    flexDirection: "row", justifyContent: "center", alignItems: "center",
    paddingVertical: 20, backgroundColor: "#FFFFFF",
  },
  registerText: { fontSize: 14, color: "#6B7280" },
  registerLink: { fontSize: 14, color: "#2563EB", fontWeight: "700" },
});
