import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/database';

export type CadetAvatarId = 'marisse' | 'charmelle' | 'chriselle' | 'king' | 'jeremiah';

interface PlayerStats {
	level: number;
	currentXP: number;
	nextLevelXP: number;
	stardust: number;
	relics: number;
	awardedSources: Record<string, boolean>;
}

interface PlayerContextValue {
	cadetAvatar: CadetAvatarId;
	setCadetAvatar: (avatar: CadetAvatarId) => void;
	level: number;
	currentXP: number;
	nextLevelXP: number;
	stardust: number;
	relics: number;
	awardXP: (amount: number, sourceId?: string) => void;
	addStardust: (amount: number) => void;
	addRelic: (amount?: number) => void;
}

const DEFAULT_AVATAR: CadetAvatarId = 'king';
const AVATAR_STORAGE_KEY = 'player.cadetAvatar';
const STATS_KEY_PREFIX = 'player.stats.'; // per-user stats

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export const usePlayer = (): PlayerContextValue => {
	const ctx = useContext(PlayerContext);
	if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
	return ctx;
};

function getDefaultStats(): PlayerStats {
	return {
		level: 1,
		currentXP: 0,
		nextLevelXP: 500,
		stardust: 0,
		relics: 0,
		awardedSources: {},
	};
}

function computeNextLevelXP(level: number): number {
	// Gentle curve: base 500, +250 per level
	return 500 + (level - 1) * 250;
}

export const PlayerProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [cadetAvatar, setCadetAvatarState] = useState<CadetAvatarId>(DEFAULT_AVATAR);
	const { user } = useAuth();
	const [stats, setStats] = useState<PlayerStats>(getDefaultStats());

	const statsKey = `${STATS_KEY_PREFIX}${user?.id || 'guest'}`;

	useEffect(() => {
		try {
			const saved = localStorage.getItem(AVATAR_STORAGE_KEY);
			if (saved) setCadetAvatarState(JSON.parse(saved) as CadetAvatarId);
		} catch {}
	}, []);

	// Load avatar from user profile if present
	useEffect(() => {
		(async () => {
			try {
				if (user) {
					const fresh = await db.getUserById(user.id);
					if ((fresh as any)?.cadetAvatar) {
						setCadetAvatarState((fresh as any).cadetAvatar as CadetAvatarId);
						localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify((fresh as any).cadetAvatar));
					}
				}
			} catch {}
		})();
	}, [user]);

	// Load stats when user changes
	useEffect(() => {
		try {
			const saved = localStorage.getItem(statsKey);
			if (saved) {
				const parsed = JSON.parse(saved) as PlayerStats;
				// Ensure nextLevelXP matches curve if missing
				if (!parsed.nextLevelXP) parsed.nextLevelXP = computeNextLevelXP(parsed.level || 1);
				if (!parsed.awardedSources) parsed.awardedSources = {};
				setStats(parsed);
			} else {
				setStats(getDefaultStats());
			}
		} catch {
			setStats(getDefaultStats());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.id]);

	const persistStats = (next: PlayerStats) => {
		try { localStorage.setItem(statsKey, JSON.stringify(next)); } catch {}
	};

	const setCadetAvatar = (avatar: CadetAvatarId) => {
		setCadetAvatarState(avatar);
		try {
			localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatar));
			if (user) {
				void db.updateUserCadetAvatar(user.id, avatar as any);
			}
		} catch {}
	};

	const awardXP = (amount: number, sourceId?: string) => {
		if (!amount || amount <= 0) return;
		setStats(prev => {
			if (sourceId && prev.awardedSources[sourceId]) {
				return prev; // already awarded for this source
			}
			let newXP = prev.currentXP + amount;
			let newLevel = prev.level;
			let nextXP = prev.nextLevelXP;
			let stardust = prev.stardust;
			let relics = prev.relics;
			const awardedSources = { ...prev.awardedSources };
			if (sourceId) awardedSources[sourceId] = true;
			// Level up loop in case large XP grants
			while (newXP >= nextXP) {
				newXP -= nextXP;
				newLevel += 1;
				nextXP = computeNextLevelXP(newLevel);
				stardust += 50; // small reward per level
			}
			const next = { level: newLevel, currentXP: newXP, nextLevelXP: nextXP, stardust, relics, awardedSources };
			persistStats(next);
			return next;
		});
	};

	const addStardust = (amount: number) => {
		if (!amount) return;
		setStats(prev => {
			const next = { ...prev, stardust: Math.max(0, prev.stardust + amount) };
			persistStats(next);
			return next;
		});
	};

	const addRelic = (amount = 1) => {
		if (!amount) return;
		setStats(prev => {
			const next = { ...prev, relics: Math.max(0, prev.relics + amount) };
			persistStats(next);
			return next;
		});
	};

	const value = useMemo<PlayerContextValue>(() => ({
		cadetAvatar,
		setCadetAvatar,
		level: stats.level,
		currentXP: stats.currentXP,
		nextLevelXP: stats.nextLevelXP,
		stardust: stats.stardust,
		relics: stats.relics,
		awardXP,
		addStardust,
		addRelic,
	}), [cadetAvatar, stats]);

	return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};


