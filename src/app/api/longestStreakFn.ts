export const longestStreakFn = async (sortedCommits: any) => {
  let longestStreak = 0;
  let longestStreakStart = '';
  let longestStreakEnd = '';
  let currentStreak = 0;
  let currentStreakStart = '';
  let currentStreakEnd = '';
  let previousCommitDate: Date | null = null;

  sortedCommits.forEach((commitDate: Date) => {
    const currentCommitDate = new Date(commitDate);
    currentCommitDate.setHours(0, 0, 0, 0);

    if (previousCommitDate === null) {
      currentStreakStart = currentCommitDate.toISOString();
      currentStreakEnd = currentCommitDate.toISOString();
      currentStreak = 1;
    } else {
      const dayDifference = (currentCommitDate.getTime() - previousCommitDate.getTime()) / (1000 * 3600 * 24);

      if (dayDifference === 1) {
        currentStreakEnd = currentCommitDate.toISOString();
        currentStreak++;
      } else if (dayDifference > 1) {
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
          longestStreakStart = currentStreakStart;
          longestStreakEnd = currentStreakEnd;
        }
        currentStreak = 1;
        currentStreakStart = currentCommitDate.toISOString();
        currentStreakEnd = currentCommitDate.toISOString();
      }
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
      longestStreakStart = currentStreakStart;
      longestStreakEnd = currentStreakEnd;
    }

    previousCommitDate = currentCommitDate;
  });

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
    longestStreakStart = currentStreakStart;
    longestStreakEnd = currentStreakEnd;
  }

  return {
    longestStreak,
    longestStreakStart,
    longestStreakEnd,
  };
};