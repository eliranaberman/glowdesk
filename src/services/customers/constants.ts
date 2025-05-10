
/**
 * Customer status enum
 */
export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LEAD = 'lead',
}

/**
 * Customer loyalty level enum
 */
export enum LoyaltyLevel {
  GOLD = 'gold',
  SILVER = 'silver',
  BRONZE = 'bronze',
  NONE = 'none',
}

/**
 * Helper function to get loyalty text from level
 */
export const getLoyaltyText = (level: string): string => {
  switch (level) {
    case LoyaltyLevel.GOLD:
      return 'זהב';
    case LoyaltyLevel.SILVER:
      return 'כסף';
    case LoyaltyLevel.BRONZE:
      return 'ברונזה';
    case LoyaltyLevel.NONE:
    default:
      return 'ללא';
  }
};

/**
 * Helper function to get status text
 */
export const getStatusText = (status: string): string => {
  switch (status) {
    case CustomerStatus.ACTIVE:
      return 'פעיל';
    case CustomerStatus.INACTIVE:
      return 'לא פעיל';
    case CustomerStatus.LEAD:
      return 'לקוח פוטנציאלי';
    default:
      return status;
  }
};
