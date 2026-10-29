/**
 * Local Matching Engine Utility
 * 
 * Implements an explainable scoring algorithm for peer matching based on:
 * - Shared technical skills: up to 45 points
 * - Shared project interests: up to 25 points
 * - Same department: 10 points
 * - Same or nearby semester: 10 points
 * - Availability overlap: 10 points
 * Total Maximum: 100 points
 */

/**
 * Calculates an explainable compatibility score and breakdown
 * between the target peer and the current logged-in user.
 * 
 * @param {Object} peer - Peer profile data
 * @param {Object} user - Current user profile data
 * @returns {Object} { matchScore, compatibilityScore, breakdown, sharedSkills, sharedInterests, sharedAvailability }
 */
export function calculateMatchScore(peer, user) {
  if (!peer || !user) {
    return {
      matchScore: 0,
      compatibilityScore: 0,
      breakdown: [],
      sharedSkills: [],
      sharedInterests: [],
      sharedAvailability: [],
    };
  }

  // 1. Shared Skills (up to 45 points)
  const peerSkills = Array.isArray(peer.skills) ? peer.skills : [];
  const userSkills = Array.isArray(user.skills) ? user.skills : [];
  const sharedSkills = peerSkills.filter((skill) =>
    userSkills.some((us) => us.toLowerCase().trim() === skill.toLowerCase().trim())
  );

  let skillsPoints = 0;
  if (peerSkills.length > 0 && userSkills.length > 0 && sharedSkills.length > 0) {
    const ratio = Math.min(1, sharedSkills.length / Math.min(Math.max(userSkills.length, 1), 3));
    skillsPoints = Math.round(ratio * 45);
  }

  // 2. Shared Interests (up to 25 points)
  const peerInterests = Array.isArray(peer.interests) ? peer.interests : [];
  const userInterests = Array.isArray(user.interests) ? user.interests : [];
  const sharedInterests = peerInterests.filter((interest) =>
    userInterests.some((ui) => ui.toLowerCase().trim() === interest.toLowerCase().trim())
  );

  let interestsPoints = 0;
  if (peerInterests.length > 0 && userInterests.length > 0 && sharedInterests.length > 0) {
    const ratio = Math.min(1, sharedInterests.length / Math.min(Math.max(userInterests.length, 1), 2));
    interestsPoints = Math.round(ratio * 25);
  }

  // 3. Same Department (10 points)
  const isSameDept =
    peer.department &&
    user.department &&
    peer.department.toLowerCase().trim() === user.department.toLowerCase().trim();
  const departmentPoints = isSameDept ? 10 : 0;

  // 4. Same or Nearby Semester (10 points)
  const peerSem = typeof peer.semester === 'number' ? peer.semester : parseInt(peer.semester, 10);
  const userSem = typeof user.semester === 'number' ? user.semester : parseInt(user.semester, 10);

  let semesterPoints = 0;
  let semesterDetail = 'Different semester';
  if (!isNaN(peerSem) && !isNaN(userSem)) {
    if (peerSem === userSem) {
      semesterPoints = 10;
      semesterDetail = `Same academic semester (Semester ${peerSem})`;
    } else if (Math.abs(peerSem - userSem) === 1) {
      semesterPoints = 5;
      semesterDetail = `Adjacent academic semester (Semester ${peerSem} vs ${userSem})`;
    } else {
      semesterDetail = `Different semester (Semester ${peerSem} vs ${userSem})`;
    }
  }

  // 5. Availability Overlap (10 points)
  let sharedAvailability = [];
  let availabilityPoints = 0;

  if (Array.isArray(peer.availability) && Array.isArray(user.availability)) {
    sharedAvailability = peer.availability.filter((avail) =>
      user.availability.some((ua) => ua.toLowerCase().trim() === avail.toLowerCase().trim())
    );
    if (sharedAvailability.length > 0) availabilityPoints = 10;
  } else {
    const peerAvail = peer.availability || {};
    const userAvail = user.availability || {};
    const peerOpenTo = Array.isArray(peerAvail.openTo) ? peerAvail.openTo : [];
    const userOpenTo = Array.isArray(userAvail.openTo) ? userAvail.openTo : [];

    const sharedOpenTo = peerOpenTo.filter((po) =>
      userOpenTo.some((uo) => uo.toLowerCase().trim() === po.toLowerCase().trim())
    );

    if (sharedOpenTo.length > 0) availabilityPoints += 5;

    const bothWeekdays = Boolean(peerAvail.weekdays && userAvail.weekdays);
    const bothWeekends = Boolean(peerAvail.weekends && userAvail.weekends);
    if (bothWeekdays || bothWeekends) availabilityPoints += 5;

    sharedAvailability = sharedOpenTo;
  }

  // Total raw score capped at 100
  const totalScore = Math.min(
    100,
    Math.max(0, skillsPoints + interestsPoints + departmentPoints + semesterPoints + availabilityPoints)
  );

  // Structured breakdown array for UI display and explainability
  const breakdown = [
    {
      category: 'skills',
      label: 'Shared Technical Skills',
      points: skillsPoints,
      maxPoints: 45,
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
      maxPoints: 10,
      detail: isSameDept
        ? `Same department (${peer.department})`
        : `Different department (${peer.department || 'N/A'} vs ${user.department || 'N/A'})`,
    },
    {
      category: 'semester',
      label: 'Semester Match',
      points: semesterPoints,
      maxPoints: 10,
      detail: semesterDetail,
    },
    {
      category: 'availability',
      label: 'Schedule Overlap',
      points: availabilityPoints,
      maxPoints: 10,
      detail:
        availabilityPoints > 0
          ? `Overlapping schedule & collaboration goals`
          : 'Non-overlapping active hours',
    },
  ];

  return {
    matchScore: totalScore,
    compatibilityScore: totalScore,
    breakdown,
    sharedSkills,
    sharedInterests,
    sharedAvailability,
  };
}

export default calculateMatchScore;
