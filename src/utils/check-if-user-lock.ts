interface User {
    failedAttempts: number;
    lockUntil: Date | null;
  }
  
  export const checkLockStatus = (log_user: User): boolean => {
    const now = Date.now();
    
    // Ensure log_user.lockUntil is not null before using getTime
    if (log_user.lockUntil && log_user.lockUntil.getTime() > now) {
      return true; // log_user is locked
    } else {
      // Reset lock and failed attempts if lock time has passed
      log_user.failedAttempts = 0;
      log_user.lockUntil = null;
      return false;
    }
  };
  