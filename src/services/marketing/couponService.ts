
import { supabase } from '@/integrations/supabase/client';
import { Coupon, CouponCreate, CouponAssignment } from '@/types/marketing';

export const getCoupons = async (): Promise<Coupon[]> => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(coupon => {
      const typedCoupon: Coupon = {
        ...coupon,
        code: '', 
        discount_percentage: coupon.discount_percentage || 0,
        description: coupon.description || null,
        valid_until: coupon.valid_until || '',
        created_at: coupon.created_at || '',
        created_by: coupon.created_by || ''
      };
      return typedCoupon;
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

export const createCoupon = async (coupon: CouponCreate): Promise<Coupon> => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .insert(coupon)
      .select()
      .single();

    if (error) throw error;
    
    const typedCoupon: Coupon = {
      ...data,
      code: coupon.code || '',
      discount_percentage: data.discount_percentage || 0,
      description: data.description || null,
      valid_until: data.valid_until || '',
      created_at: data.created_at || '',
      created_by: data.created_by || ''
    };
    
    return typedCoupon;
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
