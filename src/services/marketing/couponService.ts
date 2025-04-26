
import { supabase } from '@/integrations/supabase/client';
import { Coupon, CouponCreate, CouponUpdate, CouponAssignment } from '@/types/marketing';

// Use consistent system UUID for records created by the system
const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

export const getCoupons = async (): Promise<Coupon[]> => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

export const getCouponById = async (id: string): Promise<Coupon | null> => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching coupon ${id}:`, error);
    throw error;
  }
};

export const createCoupon = async (coupon: CouponCreate): Promise<Coupon> => {
  try {
    const couponData = {
      ...coupon,
      created_by: coupon.created_by || SYSTEM_USER_ID,
      code: coupon.code.toUpperCase() // Ensure code is always uppercase
    };

    const { data, error } = await supabase
      .from('coupons')
      .insert(couponData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }
};

export const assignCouponToClients = async (
  couponId: string, 
  clientIds: string[]
): Promise<CouponAssignment[]> => {
  try {
    const assignments = clientIds.map(clientId => ({
      coupon_id: couponId,
      client_id: clientId,
      redeemed: false
    }));

    const { data, error } = await supabase
      .from('coupon_assignments')
      .insert(assignments)
      .select();

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error assigning coupon ${couponId} to clients:`, error);
    throw error;
  }
};
