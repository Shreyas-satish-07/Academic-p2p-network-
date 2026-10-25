/**
 * Local Matching Engine Utility
 * 
 * Implements an explainable scoring algorithm for peer matching based on:
 * - Shared technical skills: up to 35 points
 * - Shared project interests: up to 25 points
 * - Same department: 15 points
 * - Same semester: 15 points
 * - Availability overlap: 10 points
 * Total Maximum: 100 points
 * 
 * Future Backend Architecture (Express + MongoDB):
 * GET  /api/users/matches      -> Returns peers sorted by algorithmic score for req.user
 * GET  /api/users/:id          -> Returns detailed profile for specific peer
 * POST /api/connections/:userId -> Sends connection request or updates collaboration state
 */

/**
 * Calculates a deterministic, explainable compatibility score and breakdown
 * between the target peer and the current logged-in user.
 * 
 * @param {Object} peer - Peer profile data
 * @param {Object} user - Current user profile data
 * @returns {Object} { matchScore, breakdown, sharedSkills, sharedInterests, sharedAvailability }
 */
export function calculateMatchScore(peer, user) {
  if (!peer || !user) {
    return {
      matchScore: 0,
      breakdown: [],
      sharedSkills: [],
      sharedInterests: [],
      sharedAvailability: [],
    };
  }

  // 1. Shared Skills (up to 35 points)
  const peerSkills = peer.skills || [];
  const userSkills = user.skills || [];
  const sharedSkills = peerSkills.filter((skill) =>
    userSkills.some((us) => us.toLowerCase() === skill.toLowerCase())
  );
  
  // Weight formula: up to 35 points based on match proportion
  let skillsPoints = 0;
  if (peerSkills.length > 0 && sharedSkills.length > 0) {
    // If 3+ shared skills or matches all user requirements, award top marks
    const ratio = sharedSkills.length / Math.min(peerSkills.length, 4);
    skillsPoints = Math.min(35, Math.round(ratio * 35));
  }

  // 2. Shared Interests (up to 25 points)
  const peerInterests = peer.interests || [];
  const userInterests = user.interests || [];
  const sharedInterests = peerInterests.filter((interest) =>
    userInterests.some((ui) => ui.toLowerCase() === interest.toLowerCase())
  );

  let interestsPoints = 0;
  if (peerInterests.length > 0 && sharedInterests.length > 0) {
    const ratio = sharedInterests.length / Math.min(peerInterests.length, 3);
    interestsPoints = Math.min(25, Math.round(ratio * 25));
  }

  // 3. Same Department (15 points)
  const isSameDept =
    peer.department &&
    user.department &&
    peer.department.toLowerCase().trim() === user.department.toLowerCase().trim();
  const departmentPoints = isSameDept ? 15 : 0;

  // 4. Same Semester (15 points)
  const isSameSemester = peer.semester && user.semester && peer.semester === user.semester;
  const semesterPoints = isSameSemester ? 15 : 0;

  // 5. Availability Overlap (10 points)
  const peerAvail = peer.availability || [];
  const userAvail = user.availability || [];
  const sharedAvailability = peerAvail.filter((avail) =>
    userAvail.some((ua) => ua.toLowerCase() === avail.toLowerCase())
  );
  const availabilityPoints = sharedAvailability.length > 0 ? 10 : 0;

  // Total raw score (capped at 100)
  const totalScore = Math.min(
    100,
    skillsPoints + interestsPoints + departmentPoints + semesterPoints + availabilityPoints
  );

  // Structured breakdown array for UI display and explainability
  const breakdown = [
    {
      category: 'skills',
      label: 'Shared Technical Skills',
      points: skillsPoints,
      maxPoints: 35,
      detail:
        sharedSkills.length > 0
          ? `${sharedSkills.length} shared technical skills (${sharedSkills.join(', ')})`
          : 'No overlapping skills found',
    },
    {
      category: 'interests',
      label: 'Project Interests',
      points: interestsPoints,
      maxPoints: 25,
      detail:
        sharedInterests.length > 0
          ? `${sharedInterests.length} shared project interests (${sharedInterests.join(', ')})`
          : 'Different domain interests',
    },
    {
      category: 'department',
      label: 'Department Alignment',
      points: departmentPoints,
      maxPoints: 15,
      detail: isSameDept
        ? `Same department (${peer.department})`
        : `Different department (${peer.department} vs ${user.department})`,
    },
    {
      category: 'semester',
      label: 'Semester Match',
      points: semesterPoints,
      maxPoints: 15,
      detail: isSameSemester
        ? `Same academic semester (Semester ${peer.semester})`
        : `Different semester (Semester ${peer.semester} vs Semester ${user.semester})`,
    },
    {
      category: 'availability',
      label: 'Schedule Overlap',
      points: availabilityPoints,
      maxPoints: 10,
      detail:
        sharedAvailability.length > 0
          ? `Overlapping schedule (${sharedAvailability.join(', ')})`
          : 'Non-overlapping active hours',
    },
  ];

  return {
    matchScore: totalScore,
    breakdown,
    sharedSkills,
    sharedInterests,
    sharedAvailability,
  };
}

export default calculateMatchScore;
