export type FollowUpData = {
  reference_number: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED' | string;
  observations: string | null;
};
