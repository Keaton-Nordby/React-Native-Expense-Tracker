import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { styles } from '../../assets/styles/auth.styles'
import { COLORS } from '../../constants/colors'
import { Ionicons } from "@expo/vector-icons"
import { Image } from 'expo-image'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState("")

  const onSignUpPress = async () => {
    if (!isLoaded) return

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err) {
      console.error(err)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>

        {error ? (
            <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setError("")}>
                    <Ionicons name="close" size={20} color={COLORS.textLight} />
                </TouchableOpacity>
            </View>
        ) : null }

        <TextInput
        style={[styles.verificationInput, error && styles.errorInput]}
          placeholder="Enter your verification code"
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center "}}>
        <View style={styles.container}>
            <Image source={require("../../assets/images/revenue-i1.png")} style={[styles.illustration, { borderRadius: 20}]}/>
      <Text style={styles.title}>Create Account</Text>
      {error ? (
            <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setError("")}>
                    <Ionicons name="close" size={20} color={COLORS.textLight} />
                </TouchableOpacity>
            </View>
        ) : null }
      <TextInput
      style={[styles.input, error && styles.errorInput]}
        autoCapitalize="none"
        placeholder="Enter email"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />
      <TextInput
      style={[styles.input, error && styles.errorInput]}
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Sign In</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  )
}
