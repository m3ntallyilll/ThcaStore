import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Edit, 
  Trash2, 
  Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import type { AdminStats } from '@/lib/types';
import type { Product } from '@shared/schema';

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('products');

  // Fetch admin stats
  const { data: stats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    enabled: user?.isAdmin,
  });

  // Fetch products for admin
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: user?.isAdmin,
  });

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-16">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-dark-800 border-r border-gray-700 min-h-screen">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-display font-bold text-gold">Admin Dashboard</h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Button
                  variant={activeSection === 'products' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection('products')}
                >
                  <Package className="w-4 h-4 mr-3" />
                  Products
                </Button>
              </li>
              <li>
                <Button
                  variant={activeSection === 'orders' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection('orders')}
                >
                  <ShoppingCart className="w-4 h-4 mr-3" />
                  Orders
                </Button>
              </li>
              <li>
                <Button
                  variant={activeSection === 'users' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection('users')}
                >
                  <Users className="w-4 h-4 mr-3" />
                  Users
                </Button>
              </li>
              <li>
                <Button
                  variant={activeSection === 'analytics' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection('analytics')}
                >
                  <DollarSign className="w-4 h-4 mr-3" />
                  Analytics
                </Button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              {activeSection === 'products' && 'Product Management'}
              {activeSection === 'orders' && 'Order Management'}
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'analytics' && 'Analytics'}
            </h1>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Products</p>
                      <p className="text-2xl font-bold">{stats.totalProducts}</p>
                    </div>
                    <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gold" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Orders</p>
                      <p className="text-2xl font-bold">{stats.totalOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-cannabis/20 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-cannabis" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Revenue</p>
                      <p className="text-2xl font-bold">${stats.totalRevenue}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Users</p>
                      <p className="text-2xl font-bold">{stats.activeUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Table */}
          {activeSection === 'products' && (
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Product Management</CardTitle>
                  <Button className="bg-gold text-black hover:bg-gold-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="text-left p-4 font-semibold">Product</th>
                        <th className="text-left p-4 font-semibold">Category</th>
                        <th className="text-left p-4 font-semibold">Price</th>
                        <th className="text-left p-4 font-semibold">Stock</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-left p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-sm text-gray-400">ID: #{product.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-400 capitalize">{product.category}</td>
                          <td className="p-4 font-semibold">${product.price}</td>
                          <td className="p-4">{product.stock} units</td>
                          <td className="p-4">
                            <Badge
                              className={
                                product.stock > 0
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-red-500/20 text-red-400'
                              }
                            >
                              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other sections */}
          {activeSection === 'orders' && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Order management features coming soon...</p>
              </CardContent>
            </Card>
          )}

          {activeSection === 'users' && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">User management features coming soon...</p>
              </CardContent>
            </Card>
          )}

          {activeSection === 'analytics' && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
