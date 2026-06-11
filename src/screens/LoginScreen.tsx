import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";

const ANNAMALAI_PHOTO =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/K._Annamalai_at_padayatra.jpg/250px-K._Annamalai_at_padayatra.jpg";

type Step = "phone" | "otp";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { loginWithPhone } = useAuth();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRef = useRef<TextInput>(null);

  const handleSendOtp = () => {
    setError("");
    if (phone.trim().length < 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setStep("otp");
    setTimeout(() => otpRef.current?.focus(), 300);
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (otp.trim().length < 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    const ok = await loginWithPhone(phone);
    setLoading(false);
    if (!ok) setError("Verification failed. Please try again.");
  };

  const handleBack = () => {
    setStep("phone");
    setOtp("");
    setError("");
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
          {step === "phone" ? (
            <>
              <Text style={styles.cardTitle}>Welcome</Text>
              <Text style={styles.cardSub}>Enter your mobile number to continue</Text>

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
                    returnKeyType="done"
                    onSubmitEditing={handleSendOtp}
                    autoFocus
                  />
                </View>
              </View>

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[styles.primaryBtn, phone.length < 10 && styles.btnDim]}
                onPress={handleSendOtp}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Send OTP</Text>
              </TouchableOpacity>

              <Text style={styles.disclaimer}>
                OTP will be sent to your registered mobile number
              </Text>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={handleBack} style={styles.backRow}>
                <Text style={styles.backArrow}>←</Text>
                <Text style={styles.backText}>+91 {phone}</Text>
              </TouchableOpacity>

              <Text style={styles.cardTitle}>Verify OTP</Text>
              <Text style={styles.cardSub}>
                Enter the 6-digit code sent to{"\n"}+91 {phone}
              </Text>

              <View style={styles.fieldWrap}>
                <Text style={styles.label}>One-Time Password</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    ref={otpRef}
                    style={[styles.input, styles.otpInput]}
                    placeholder="• • • • • •"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={(t) => { setOtp(t); setError(""); }}
                    returnKeyType="done"
                    onSubmitEditing={handleVerifyOtp}
                  />
                </View>
              </View>

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[styles.primaryBtn, (otp.length < 6 || loading) && styles.btnDim]}
                onPress={handleVerifyOtp}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Verify & Continue</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSendOtp} style={styles.resendRow}>
                <Text style={styles.resendText}>Didn't receive OTP? </Text>
                <Text style={styles.resendLink}>Resend</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={{ height: insets.bottom + 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#2563EB" },
  scroll: { flexGrow: 1, backgroundColor: "#2563EB" },

  hero: { alignItems: "center", paddingTop: 36, paddingBottom: 40 },
  logoCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: "#EAB308",
    overflow: "hidden",
    backgroundColor: "#1e40af",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  heroImage: { width: "100%", height: "100%" },
  appName: {
    fontSize: 40,
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

  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    flex: 1,
    minHeight: 420,
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  backArrow: { fontSize: 20, color: "#2563EB" },
  backText: { fontSize: 14, color: "#2563EB", fontWeight: "600" },

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
    lineHeight: 20,
  },

  fieldWrap: { marginBottom: 20 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    height: 56,
  },
  prefix: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "600",
  },
  dividerV: {
    width: 1,
    height: 22,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 12,
  },
  input: { flex: 1, fontSize: 15, color: "#111827" },
  otpInput: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 8,
    textAlign: "center",
  },

  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginBottom: 12,
    marginTop: -8,
  },

  primaryBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  btnDim: { opacity: 0.55 },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  disclaimer: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 14,
    lineHeight: 17,
  },

  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  resendText: { fontSize: 14, color: "#6B7280" },
  resendLink: { fontSize: 14, color: "#2563EB", fontWeight: "700" },
});
