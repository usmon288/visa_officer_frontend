import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check, Crown, Zap, ArrowLeft, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriptionData {
  plan: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

interface UsageData {
  interview_count: number;
  limit: number | 'unlimited';
  plan: string;
  can_start_interview: boolean;
  remaining: number | 'unlimited';
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'Forever',
    interviews: 1,
    features: [
      '1 interview per month',
      'Basic feedback',
      'Email support',
    ],
    icon: Zap,
    gradient: 'from-gray-500 to-gray-700',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$14.99',
    period: 'per month',
    interviews: 10,
    features: [
      '10 interviews per month',
      'Detailed feedback',
      'Priority support',
      'Interview history',
    ],
    icon: TrendingUp,
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$39.99',
    period: 'per month',
    interviews: 'Unlimited',
    features: [
      'Unlimited interviews',
      'Advanced analytics',
      'Priority support',
      'Interview history',
      'Custom practice scenarios',
    ],
    icon: Crown,
    gradient: 'from-purple-500 to-purple-700',
  },
];

export default function Subscription() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subData, usageData] = await Promise.all([
        subscriptionsAPI.getCurrent(),
        subscriptionsAPI.getUsage(),
      ]);
      setSubscription(subData);
      setUsage(usageData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load data',
        description: error instanceof Error ? error.message : 'Could not load subscription information',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return;

    setUpgrading(planId);
    try {
      await subscriptionsAPI.create(planId as 'starter' | 'professional');
      toast({
        title: 'Subscription updated!',
        description: 'Your subscription has been successfully updated.',
      });
      await loadData();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upgrade failed',
        description: error instanceof Error ? error.message : 'Could not upgrade subscription',
      });
    } finally {
      setUpgrading(null);
    }
  };

  const handleCancel = async () => {
    try {
      await subscriptionsAPI.cancel();
      toast({
        title: 'Subscription canceled',
        description: 'Your subscription will remain active until the end of the billing period.',
      });
      await loadData();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Cancel failed',
        description: error instanceof Error ? error.message : 'Could not cancel subscription',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentPlan = subscription?.plan || 'free';
  const isCurrentPlan = (planId: string) => currentPlan === planId;

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-background to-muted">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold mb-2">Subscription Plans</h1>
          <p className="text-muted-foreground">
            Choose the plan that works best for you
          </p>
        </div>

        {/* Current Usage */}
        {usage && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Usage</CardTitle>
              <CardDescription>
                Your interview usage for this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {usage.interview_count} / {usage.limit === 'unlimited' ? '∞' : usage.limit}
                  </p>
                  <p className="text-sm text-muted-foreground">Interviews used</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {usage.remaining === 'unlimited' ? '∞' : usage.remaining} remaining
                  </p>
                  <p className="text-sm text-muted-foreground">Current plan: {usage.plan}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = isCurrentPlan(plan.id);
            const isUpgrading = upgrading === plan.id;
            const canUpgrade = plan.id !== 'free' && !isCurrent;

            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative overflow-hidden",
                  isCurrent && "ring-2 ring-primary"
                )}
              >
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg">
                    Current Plan
                  </div>
                )}
                <CardHeader>
                  <div className={cn(
                    "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4",
                    plan.gradient
                  )}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground"> / {plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="mt-2">
                    {plan.interviews} {typeof plan.interviews === 'number' ? 'interviews' : 'interviews'} per month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleCancel}
                      disabled={plan.id === 'free' || subscription?.cancel_at_period_end}
                    >
                      {subscription?.cancel_at_period_end
                        ? 'Canceling at period end'
                        : 'Cancel Subscription'}
                    </Button>
                  ) : (
                    <Button
                      className={cn(
                        "w-full",
                        plan.id === 'professional' && "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
                      )}
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isUpgrading || plan.id === 'free'}
                    >
                      {isUpgrading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        canUpgrade ? 'Upgrade' : 'Current Plan'
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Note */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>All plans include access to all visa interview types and AI-powered feedback.</p>
          <p className="mt-1">Cancel anytime. No hidden fees.</p>
        </div>
      </div>
    </div>
  );
}

