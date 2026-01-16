/**
 * GRIHGO Customer App - Language Selection Screen
 * App language settings
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft,
    Check,
    Globe,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TOUCH_TARGETS } from '../../constants';
import { Button } from '../../components/ui';

interface Language {
    id: string;
    name: string;
    nativeName: string;
    code: string;
}

const LANGUAGES: Language[] = [
    { id: '1', name: 'English', nativeName: 'English', code: 'en' },
    { id: '2', name: 'Hindi', nativeName: 'हिन्दी', code: 'hi' },
    { id: '3', name: 'Kannada', nativeName: 'ಕನ್ನಡ', code: 'kn' },
    { id: '4', name: 'Tamil', nativeName: 'தமிழ்', code: 'ta' },
    { id: '5', name: 'Telugu', nativeName: 'తెలుగు', code: 'te' },
    { id: '6', name: 'Malayalam', nativeName: 'മലയാളം', code: 'ml' },
    { id: '7', name: 'Marathi', nativeName: 'मराठी', code: 'mr' },
    { id: '8', name: 'Bengali', nativeName: 'বাংলা', code: 'bn' },
    { id: '9', name: 'Gujarati', nativeName: 'ગુજરાતી', code: 'gu' },
    { id: '10', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', code: 'pa' },
];

export default function LanguageScreen() {
    const { colors } = useTheme();
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const handleSave = () => {
        const language = LANGUAGES.find((l) => l.code === selectedLanguage);
        Alert.alert(
            'Language Changed',
            `App language set to ${language?.name}. This will take effect on next restart.`,
            [{ text: 'OK', onPress: () => router.back() }]
        );
    };

    const renderLanguage = (language: Language) => {
        const isSelected = selectedLanguage === language.code;

        return (
            <TouchableOpacity
                key={language.id}
                style={[
                    styles.languageCard,
                    { backgroundColor: colors.surface },
                    isSelected && { borderColor: colors.primary, borderWidth: 2 },
                ]}
                onPress={() => setSelectedLanguage(language.code)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${language.name}, ${language.nativeName}`}
            >
                <View style={[styles.languageIcon, { backgroundColor: colors.primary + '15' }]}>
                    <Globe size={20} color={colors.primary} />
                </View>
                <View style={styles.languageInfo}>
                    <Text style={[styles.languageName, { color: colors.text }]}>
                        {language.name}
                    </Text>
                    <Text style={[styles.languageNative, { color: colors.textSecondary }]}>
                        {language.nativeName}
                    </Text>
                </View>
                {isSelected && (
                    <View style={[styles.checkContainer, { backgroundColor: colors.primary }]}>
                        <Check size={16} color="#FFFFFF" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Language</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Info Text */}
            <View style={styles.infoContainer}>
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                    Select your preferred language for the app
                </Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.languageList} accessibilityRole="radiogroup">
                    {LANGUAGES.map(renderLanguage)}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Save Button */}
            <View style={[styles.footer, { backgroundColor: colors.background }]}>
                <Button
                    title="Save Changes"
                    onPress={handleSave}
                    variant="primary"
                    style={{ flex: 1 }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    backButton: {
        width: TOUCH_TARGETS.minimum,
        height: TOUCH_TARGETS.minimum,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        ...TYPOGRAPHY.h3,
    },
    infoContainer: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
    },
    infoText: {
        ...TYPOGRAPHY.body,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    languageList: {
        gap: SPACING.sm,
    },
    languageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    languageIcon: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    languageInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    languageName: {
        ...TYPOGRAPHY.bodyMedium,
    },
    languageNative: {
        ...TYPOGRAPHY.caption,
        marginTop: 2,
    },
    checkContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        paddingBottom: SPACING.xl,
        ...SHADOWS.lg,
    },
});
