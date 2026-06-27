import { useState } from 'react';
import SetupScreen from './components/setup/SetupScreen';
import InterviewScreen from './components/interview/InterviewScreen';
import ScorecardScreen from './components/scorecard/ScorecardScreen';

// New screen imports
import LoginScreen from './components/auth/LoginScreen';
import SignupScreen from './components/auth/SignupScreen';
import DashboardScreen from './components/dashboard/DashboardScreen';

// App phases updated: 'login' | 'signup' | 'dashboard' | 'setup' | 'interviewing' | 'scorecard'
const App = () => {
  const [phase, setPhase] = useState('login'); // Starts directly at login now
  const [user, setUser] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [jobDomain, setJobDomain] = useState('Frontend Developer');
  const [scorecard, setScorecard] = useState(null);

  // Authentication Handlers
  const handleLogin = (userData) => {
    setUser(userData);
    setCandidateName(userData.name); // Automatically assign name to setup variable
    setPhase('dashboard');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setCandidateName(userData.name); // Automatically assign name to setup variable
    setPhase('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCandidateName('');
    setPhase('login');
  };

  // Interview Handlers
  const handleStartInterview = () => {
    setPhase('interviewing');
  };

  const handleEndInterview = (scorecardData) => {
    setScorecard(scorecardData);
    setPhase('scorecard');
  };

  const handleRestart = () => {
    setScorecard(null);
    setPhase('dashboard'); // Sends them back to dashboard to view records instead of wiping clean
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* 1. Login Stage */}
      {phase === 'login' && (
        <LoginScreen 
          onLogin={handleLogin} 
          onNavigateToSignup={() => setPhase('signup')} 
        />
      )}

      {/* 2. Registration Stage */}
      {phase === 'signup' && (
        <SignupScreen 
          onSignup={handleSignup} 
          onNavigateToLogin={() => setPhase('login')} 
        />
      )}

      {/* 3. Central Progress Tracker Dashboard */}
      {phase === 'dashboard' && (
        <DashboardScreen 
          user={user} 
          onStartNewInterview={() => setPhase('setup')} 
          onLogout={handleLogout}
        />
      )}

      {/* 4. Configuration Stage */}
      {phase === 'setup' && (
        <SetupScreen
          candidateName={candidateName}
          setCandidateName={setCandidateName}
          jobDomain={jobDomain}
          setJobDomain={setJobDomain}
          onStart={handleStartInterview}
        />
      )}

      {/* 5. Active Interview Engagement */}
      {phase === 'interviewing' && (
        <InterviewScreen
          candidateName={candidateName}
          jobDomain={jobDomain}
          onEnd={handleEndInterview}
        />
      )}

      {/* 6. Performance Insights Summary */}
      {phase === 'scorecard' && scorecard && (
        <ScorecardScreen
          scorecard={scorecard}
          candidateName={candidateName}
          jobDomain={jobDomain}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default App;