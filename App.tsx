import React, { useState, useCallback, useMemo } from 'react';
import { AppContext } from './contexts/AppContext';
import type { User, View, AppContextType } from './types';
import Login from './components/auth/Login';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import LearningHub from './components/learning/LearningHub';
import ComparisonGame from './components/learning/ComparisonGame';
import NumberLearning from './components/learning/NumberLearning';
import WritingPractice from './components/learning/WritingPractice';
import MarioGame from './components/learning/MarioGame';
import Rewards from './components/rewards/Rewards';
import Reports from './components/reports/Reports';
import StudentProfile from './components/profile/StudentProfile';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [view, setView] = useState<View>('dashboard');

    // Mock Authentication
    const login = useCallback(async (email: string, password: string) => {
        console.log('Logging in with', email, password);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (email.includes('error')) {
            throw new Error('Email hoặc mật khẩu không đúng!');
        }
        setUser({
            id: '1',
            name: 'Bé A',
            email: email,
            avatar: `https://i.pravatar.cc/150?u=${email}`,
            stars: 1234
        });
    }, []);

    const register = useCallback(async (name: string, email: string, password: string) => {
        console.log('Registering', name, email, password);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (email.includes('exists')) {
            throw new Error('Email này đã được sử dụng!');
        }
        setUser({
            id: '2',
            name: name,
            email: email,
            avatar: `https://i.pravatar.cc/150?u=${email}`,
            stars: 0
        });
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);
    
    const addStars = useCallback((amount: number) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            return { ...currentUser, stars: currentUser.stars + amount };
        });
    }, []);

    const renderView = () => {
        switch(view) {
            case 'dashboard': return <Dashboard />;
            case 'learning-hub': return <LearningHub />;
            case 'comparison-game': return <ComparisonGame />;
            case 'number-learning': return <NumberLearning />;
            case 'writing-practice': return <WritingPractice />;
            case 'mario-game': return <MarioGame />;
            case 'rewards': return <Rewards />;
            case 'reports': return <Reports />;
            case 'profile': return <StudentProfile />;
            default: return <Dashboard />;
        }
    };
    
    const appContextValue = useMemo<AppContextType>(() => ({
        user,
        view,
        setView,
        login,
        register,
        logout,
        addStars,
    }), [user, view, login, register, logout, addStars]);

    if (!user) {
        return (
            <AppContext.Provider value={appContextValue}>
                <Login onLogin={login} onRegister={register} />
            </AppContext.Provider>
        );
    }

    return (
        <AppContext.Provider value={appContextValue}>
            <div className="min-h-screen bg-pink-50/50 font-sans">
                <Header />
                <main>
                    {renderView()}
                </main>
            </div>
        </AppContext.Provider>
    );
};

export default App;
