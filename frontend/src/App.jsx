import { useState } from 'react';
import SetupScreen from './components/setup/SetupScreen';
import InterviewScreen from './components/interview/InterviewScreen';
import ScorecardScreen from './components/scorecard/ScorecardScreen';

// App phases: 'setup' | 'interviewing' | 'scorecard'
const App = () => {
  const [phase, setPhase] = useState('setup');
  const [candidateName, setCandidateName] = useState('');
  const [jobDomain, setJobDomain] = useState('Frontend Developer');
  const [scorecard, setScorecard] = useState(null);

  const handleStartInterview = () => {
    setPhase('interviewing');
  };

  const handleEndInterview = (scorecardData) => {
    setScorecard(scorecardData);
    setPhase('scorecard');
  };

  const handleRestart = () => {
    setCandidateName('');
    setJobDomain('Frontend Developer');
    setScorecard(null);
    setPhase('setup');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {phase === 'setup' && (
        <SetupScreen
          candidateName={candidateName}
          setCandidateName={setCandidateName}
          jobDomain={jobDomain}
          setJobDomain={setJobDomain}
          onStart={handleStartInterview}
        />
      )}

      {phase === 'interviewing' && (
        <InterviewScreen
          candidateName={candidateName}
          jobDomain={jobDomain}
          onEnd={handleEndInterview}
        />
      )}

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
