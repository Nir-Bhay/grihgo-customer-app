/**
 * GRIHGO Customer App - Search Screen
 * Restaurant and dish search with filters
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Search,
    Mic,
    X,
    History,
    TrendingUp,
    Star,
    Clock,
    Leaf,
    Tag,
    ChevronRight,
    ArrowLeft,
    SlidersHorizontal,
} from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS, TOUCH_TARGETS } from '../../constants';
import { RestaurantCard } from '../../components/cards';
import { EmptyState } from '../../components/ui';
import { RESTAURANTS } from '../../data/mockData';

const RECENT_SEARCHES = ['Biryani', 'Pizza', 'Burger', 'Chinese'];
const TRENDING_SEARCHES = [
    'Chicken Biryani',
    'Margherita Pizza',
    'Butter Chicken',
    'Masala Dosa',
    'Pav Bhaji',
];

const FILTERS = [
    { id: 'rating', label: 'Rating 4.0+', icon: Star },
    { id: 'time', label: 'Under 30 min', icon: Clock },
    { id: 'veg', label: 'Pure Veg', icon: Leaf },
    { id: 'offers', label: 'Offers', icon: Tag },
];

export default function SearchScreen() {
    const { colors } = useTheme();
    const { query: initialQuery } = useLocalSearchParams<{ query?: string }>();
    const [searchQuery, setSearchQuery] = useState(initialQuery || '');
    const [isSearching, setIsSearching] = useState(!!initialQuery);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (!initialQuery) {
            // Auto-focus on empty search
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, []);

    // Simulate search with loading
    const performSearch = useCallback((text: string) => {
        if (text.length > 0) {
            setIsLoading(true);
            // Simulate network delay
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
    }, []);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        setIsSearching(text.length > 0);
        performSearch(text);
    };

    const handleClear = () => {
        setSearchQuery('');
        setIsSearching(false);
        inputRef.current?.focus();
    };

    const handleClearRecent = () => {
        setRecentSearches([]);
    };

    const handleTagPress = (tag: string) => {
        setSearchQuery(tag);
        setIsSearching(true);
        performSearch(tag);
        Keyboard.dismiss();

        // Add to recent searches if not already there
        if (!recentSearches.includes(tag)) {
            setRecentSearches(prev => [tag, ...prev.slice(0, 4)]);
        }
    };

    const toggleFilter = (filterId: string) => {
        setActiveFilters((prev) =>
            prev.includes(filterId)
                ? prev.filter((id) => id !== filterId)
                : [...prev, filterId]
        );
    };

    // Filter restaurants based on search and active filters
    const filteredRestaurants = RESTAURANTS.filter((r) => {
        // Text search
        const matchesSearch =
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.cuisines.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        // Apply filters
        if (activeFilters.includes('rating') && r.rating < 4.0) return false;
        if (activeFilters.includes('veg') && !r.cuisines.some(c =>
            c.toLowerCase().includes('vegetarian') || c.toLowerCase().includes('veg')
        )) return false;
        if (activeFilters.includes('offers') && !r.offer) return false;
        // Time filter would need deliveryTime parsing in real app

        return true;
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Search Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <View
                    style={[styles.searchContainer, { backgroundColor: colors.surface }]}
                    accessibilityRole="search"
                >
                    <Search size={20} color={colors.textSecondary} />
                    <TextInput
                        ref={inputRef}
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Search for restaurants, dishes..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={handleSearch}
                        returnKeyType="search"
                        autoCapitalize="none"
                        autoCorrect={false}
                        accessibilityLabel="Search input"
                        accessibilityHint="Type to search for restaurants or dishes"
                    />
                    {isLoading ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : searchQuery.length > 0 ? (
                        <TouchableOpacity
                            onPress={handleClear}
                            accessibilityLabel="Clear search"
                            accessibilityRole="button"
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <X size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.voiceButton}
                            accessibilityLabel="Voice search"
                            accessibilityRole="button"
                        >
                            <Mic size={20} color={colors.primary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {isSearching ? (
                <>
                    {/* Filters */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.filtersContainer}
                        contentContainerStyle={styles.filtersContent}
                        accessibilityRole="toolbar"
                        accessibilityLabel="Search filters"
                    >
                        {FILTERS.map((filter) => {
                            const isActive = activeFilters.includes(filter.id);
                            return (
                                <TouchableOpacity
                                    key={filter.id}
                                    style={[
                                        styles.filterChip,
                                        {
                                            backgroundColor: isActive ? colors.primary : colors.surface,
                                            borderColor: isActive ? colors.primary : colors.border,
                                        },
                                    ]}
                                    onPress={() => toggleFilter(filter.id)}
                                    accessibilityRole="checkbox"
                                    accessibilityState={{ checked: isActive }}
                                    accessibilityLabel={filter.label}
                                >
                                    <filter.icon
                                        size={16}
                                        color={isActive ? '#FFFFFF' : colors.textSecondary}
                                    />
                                    <Text
                                        style={[
                                            styles.filterText,
                                            { color: isActive ? '#FFFFFF' : colors.text },
                                        ]}
                                    >
                                        {filter.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Results */}
                    <ScrollView
                        style={styles.resultsContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={colors.primary} />
                                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                                    Searching...
                                </Text>
                            </View>
                        ) : filteredRestaurants.length > 0 ? (
                            <>
                                <Text
                                    style={[styles.resultCount, { color: colors.textSecondary }]}
                                    accessibilityRole="text"
                                >
                                    {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
                                </Text>

                                {filteredRestaurants.map((restaurant) => (
                                    <RestaurantCard
                                        key={restaurant.id}
                                        restaurant={restaurant}
                                        variant="horizontal"
                                    />
                                ))}
                            </>
                        ) : (
                            <EmptyState
                                variant="search"
                                title="No results found"
                                subtitle={`We couldn't find any restaurants matching "${searchQuery}". Try a different search term.`}
                                actionText="Clear Search"
                                onAction={handleClear}
                            />
                        )}

                        <View style={{ height: 100 }} />
                    </ScrollView>
                </>
            ) : (
                <ScrollView
                    style={styles.suggestionsContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                    Recent Searches
                                </Text>
                                <TouchableOpacity
                                    onPress={handleClearRecent}
                                    accessibilityLabel="Clear recent searches"
                                    accessibilityRole="button"
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Text style={[styles.clearText, { color: colors.primary }]}>Clear</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.tagsContainer}>
                                {recentSearches.map((term, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.tag, { backgroundColor: colors.surface }]}
                                        onPress={() => handleTagPress(term)}
                                        accessibilityLabel={`Search for ${term}`}
                                        accessibilityRole="button"
                                    >
                                        <History size={14} color={colors.textSecondary} />
                                        <Text style={[styles.tagText, { color: colors.text }]}>{term}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Trending Searches */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                Trending Near You
                            </Text>
                            <TrendingUp size={20} color={colors.primary} />
                        </View>
                        {TRENDING_SEARCHES.map((term, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.trendingItem}
                                onPress={() => handleTagPress(term)}
                                accessibilityLabel={`Trending search: ${term}`}
                                accessibilityRole="button"
                            >
                                <Text style={[styles.trendingNumber, { color: colors.textSecondary }]}>
                                    {index + 1}
                                </Text>
                                <Text style={[styles.trendingText, { color: colors.text }]}>
                                    {term}
                                </Text>
                                <View style={{ flex: 1 }} />
                                <ChevronRight size={20} color={colors.border} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Popular Categories */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Popular Categories
                        </Text>
                        <View style={styles.categoriesGrid}>
                            {['Pizza', 'Biryani', 'Chinese', 'Burger', 'South Indian', 'Desserts'].map((category) => (
                                <TouchableOpacity
                                    key={category}
                                    style={[styles.categoryChip, { backgroundColor: colors.surface }]}
                                    onPress={() => handleTagPress(category)}
                                    accessibilityLabel={`Search for ${category}`}
                                    accessibilityRole="button"
                                >
                                    <Text style={[styles.categoryText, { color: colors.text }]}>
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        gap: SPACING.md,
    },
    backButton: {
        width: TOUCH_TARGETS.minimum,
        height: TOUCH_TARGETS.minimum,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        height: TOUCH_TARGETS.recommended,
        borderRadius: RADIUS.md,
        gap: SPACING.sm,
    },
    input: {
        flex: 1,
        ...TYPOGRAPHY.body,
        height: '100%',
    },
    voiceButton: {
        padding: SPACING.xs,
    },
    filtersContainer: {
        maxHeight: 50,
    },
    filtersContent: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        gap: SPACING.xs,
        marginRight: SPACING.sm,
        minHeight: TOUCH_TARGETS.minimum,
    },
    filterText: {
        ...TYPOGRAPHY.caption,
    },
    resultsContainer: {
        flex: 1,
        marginTop: SPACING.md,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: SPACING.huge,
    },
    loadingText: {
        ...TYPOGRAPHY.bodySmall,
        marginTop: SPACING.md,
    },
    resultCount: {
        ...TYPOGRAPHY.caption,
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    suggestionsContainer: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.xxl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h4,
    },
    clearText: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.full,
        gap: SPACING.xs,
        minHeight: TOUCH_TARGETS.minimum,
    },
    tagText: {
        ...TYPOGRAPHY.bodySmall,
    },
    trendingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        gap: SPACING.md,
        minHeight: TOUCH_TARGETS.minimum,
    },
    trendingNumber: {
        ...TYPOGRAPHY.bodyMedium,
        width: 24,
    },
    trendingText: {
        ...TYPOGRAPHY.body,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginTop: SPACING.md,
    },
    categoryChip: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.lg,
        minHeight: TOUCH_TARGETS.minimum,
        justifyContent: 'center',
    },
    categoryText: {
        ...TYPOGRAPHY.bodySmallMedium,
    },
});
