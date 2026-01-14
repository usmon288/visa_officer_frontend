import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Download } from "lucide-react";

export default function BillingPage() {
  const navigate = useNavigate();

  const invoices = [];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Billing</h1>
            <p className="text-muted-foreground">Manage your subscription and payment methods</p>
          </div>
          <Button onClick={() => navigate("/subscription")}>Manage Subscription</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 rounded-lg border">
              <CreditCard className="w-8 h-8 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium">No payment method</div>
                <div className="text-sm text-muted-foreground">Add a payment method to upgrade your plan</div>
              </div>
              <Button variant="outline">Add Card</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>Download your past invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mx-auto mb-4">
                  <Download className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No invoices yet</h3>
                <p className="text-muted-foreground">Your invoice history will appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {invoices.map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <div className="font-medium">{invoice.date}</div>
                      <div className="text-sm text-muted-foreground">{invoice.amount}</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
