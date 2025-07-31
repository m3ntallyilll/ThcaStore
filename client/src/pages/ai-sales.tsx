import { AISalesStrategy } from '@/components/ai/ai-sales-strategy';
import { AdminRoute } from '@/components/admin/admin-route';

export default function AISalesPage() {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-dark-900 pt-20">
        <AISalesStrategy />
      </div>
    </AdminRoute>
  );
}