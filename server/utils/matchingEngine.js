/**
 * Matching Engine Utility
 * 
 * Computes an explainable compatibility score (0-100) between two students based on:
 * - Shared technical skills: 45% (up to 45 pts)
 * - Shared project / domain interests: 25% (up to 25 pts)
 * - Same academic department: 10% (10 pts)
 * - Same or nearby semester: 10% (10 pts for same, 5 pts for adjacent)
 * - Overlapping availability and collaboration preferences: 10% (up to 10 pts)
 */

/**
 * Calculate compatibility between target peer and current user
 * 
 * @param {Object} peer - Peer user document or safe object
 * @param {Object} currentUser - Current authenticated user document or safe object
 * @returns {Object} { compatibilityScore, matchScore, matchedSkills, matchedInterests, matchReasons, breakdown }
 */
export function calculateCompatibility(peer, currentUser) {
  if (!peer || !currentUser) {
    return {
      compatibilityScore: 0,
      matchScore: 0,
      matchedSkills: [],
      matchedInterests: [],
      matchReasons: [],
      breakdown: [],
    };
  }

  const matchReasons = [];

  // 1. Shared Skills (45% weight)
  const peerSkills = Array.isArray(peer.skills) ? peer.skills : [];
  const userSkills = Array.isArray(currentUser.skills) ? currentUser.skills : [];

  const matchedSkills = peerSkills.filter((ps) =>
    userSkills.some((us) => us.trim().toLowerCase() === ps.trim().toLowerCase())
  );

  let skillsPoints = 0;
  if (peerSkills.length > 0 && userSkills.length > 0 && matchedSkills.length > 0) {
    // If they share 3 or more skills, or match all target skills, award full 45 points
    const skillRatio = Math.min(
      1,
      matchedSkills.length / Math.min(Math.max(userSkills.length, 1), 3)
    );
    skillsPoints = Math.round(skillRatio * 45);
    matchReasons.push(
      `Shared technical skills (${matchedSkills.slice(0, 4).join(', ')})`
    );
  }

  // 2. Shared Interests (25% weight)
  const peerInterests = Array.isArray(peer.interests) ? peer.interests : [];
  const userInterests = Array.isArray(currentUser.interests) ? currentUser.interests : [];

  const matchedInterests = peerInterests.filter((pi) =>
    userInterests.some((ui) => ui.trim().toLowerCase() === pi.trim().toLowerCase())
  );

  let interestsPoints = 0;
  if (peerInterests.length > 0 && userInterests.length > 0 && matchedInterests.length > 0) {
    // If they share 2 or more interests, award full 25 points
    const interestRatio = Math.min(
      1,
      matchedInterests.length / Math.min(Math.max(userInterests.length, 1), 2)
    );
    interestsPoints = Math.round(interestRatio * 25);
    matchReasons.push(
      `Shared collaboration interests (${matchedInterests.slice(0, 3).join(', ')})`
    );
  }

  // 3. Department Alignment (10% weight)
  let departmentPoints = 0;
  const peerDept = peer.department?.trim();
  const userDept = currentUser.department?.trim();

  if (peerDept && userDept && peerDept.toLowerCase() === userDept.toLowerCase()) {
    departmentPoints = 10;
    matchReasons.push(`Same department (${peerDept})`);
  }

  // 4. Same or Nearby Semester (10% weight)
  let semesterPoints = 0;
  const peerSem = typeof peer.semester === 'number' ? peer.semester : parseInt(peer.semester, 10);
  const userSem = typeof currentUser.semester === 'number' ? currentUser.semester : parseInt(currentUser.semester, 10);

  if (!isNaN(peerSem) && !isNaN(userSem)) {
    if (peerSem === userSem) {
      semesterPoints = 10;
      matchReasons.push(`Same academic semester (Semester ${peerSem})`);
    } else if (Math.abs(peerSem - userSem) === 1) {
      semesterPoints = 5;
      matchReasons.push(`Nearby academic semester (Semester ${peerSem} vs ${userSem})`);
    }
  }

  // 5. Overlapping Availability & Preferences (10% weight)
  let availabilityPoints = 0;
  const peerAvail = peer.availability || {};
  const userAvail = currentUser.availability || {};

  // Check openTo tags overlap
  const peerOpenTo = Array.isArray(peerAvail.openTo) ? peerAvail.openTo : [];
  const userOpenTo = Array.isArray(userAvail.openTo) ? userAvail.openTo : [];
  const sharedOpenTo = peerOpenTo.filter((po) =>
    userOpenTo.some((uo) => uo.trim().toLowerCase() === po.trim().toLowerCase())
  );

  if (sharedOpenTo.length > 0) {
    availabilityPoints += 5;
  }

  // Check schedule availability overlap (weekdays / weekends)
  const peerHasWeekdays = Boolean(peerAvail.weekdays && peerAvail.weekdays.trim());
  const userHasWeekdays = Boolean(userAvail.weekdays && userAvail.weekdays.trim());
  const peerHasWeekends = Boolean(peerAvail.weekends && peerAvail.weekends.trim());
  const userHasWeekends = Boolean(userAvail.weekends && userAvail.weekends.trim());

  if ((peerHasWeekdays && userHasWeekdays) || (peerHasWeekends && userHasWeekends)) {
    availabilityPoints += 5;
  }

  if (availabilityPoints > 0) {
    if (sharedOpenTo.length > 0) {
      matchReasons.push(`Aligned collaboration goals (${sharedOpenTo.slice(0, 2).join(', ')})`);
    } else {
      matchReasons.push('Compatible study sprint and project schedule');
    }
  }

  // Total compatibility score bounded between 0 and 100
  const rawTotal = skillsPoints + interestsPoints + departmentPoints + semesterPoints + availabilityPoints;
  const compatibilityScore = Math.min(100, Math.max(0, Math.round(rawTotal)));

  // If no synergy reasons were identified, provide default notice
  if (matchReasons.length === 0) {
    matchReasons.push('Cross-domain collaboration opportunity');
  }

  // Structured breakdown for UI inspectability
  const breakdown = [
    {
      category: 'skills',
      label: 'Technical Skills Alignment',
      points: skillsPoints,
      maxPoints: 45,
      detail:
        matchedSkills.length > 0
          ? `${matchedSkills.length} shared skills (${matchedSkills.join(', ')})`
          : 'No overlapping technical skills',
    },
    {
      category: 'interests',
      label: 'Collaboration Interests',
      points: interestsPoints,
      maxPoints: 25,
      detail:
        matchedInterests.length > 0
          ? `${matchedInterests.length} shared interests (${matchedInterests.join(', ')})`
          : 'Different domain interests',
    },
    {
      category: 'department',
      label: 'Department Alignment',
      points: departmentPoints,
      maxPoints: 10,
      detail: departmentPoints > 0
        ? `Same department (${peerDept})`
        : `Different department (${peerDept || 'N/A'} vs ${userDept || 'N/A'})`,
    },
    {
      category: 'semester',
      label: 'Semester Proximity',
      points: semesterPoints,
      maxPoints: 10,
      detail: semesterPoints === 10
        ? `Exact semester match (Semester ${peerSem})`
        : semesterPoints === 5
        ? `Adjacent semester (Semester ${peerSem} vs ${userSem})`
        : `Different academic standing (Semester ${peerSem} vs ${userSem})`,
    },
    {
      category: 'availability',
      label: 'Schedule & Squad Goals',
      points: availabilityPoints,
      maxPoints: 10,
      detail: availabilityPoints > 0
        ? 'Overlapping study schedule and collaboration dynamics'
        : 'Different active hours or team size preferences',
    },
  ];

  return {
    compatibilityScore,
    matchScore: compatibilityScore, // Alias for seamless compatibility with frontend
    matchedSkills,
    matchedInterests,
    matchReasons,
    breakdown,
  };
}

export default calculateCompatibility;
