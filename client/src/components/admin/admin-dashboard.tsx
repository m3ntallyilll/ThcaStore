import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Edit, 
  Trash2, 
  Plus,
  FileText,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { AdminStats } from '@/lib/types';
import type { Product } from '@shared/schema';
import { BlogManagement } from './blog-management';
import { AIChat } from '@/components/ai/ai-chat';
import AIDealsGenerator from './ai-deals-generator';
import { AISEOManager } from './ai-seo-manager';

interface OrderWithDetails {
  id: string;
  userId: string;
  status: string;
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  shippingMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone?: string;
  shippingAddress: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  paymentStatus: string;
  createdAt: string;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [blogFormData, setBlogFormData] = useState<any>(null);

  // Fetch admin stats with optimized polling
  const { data: stats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    enabled: !!user?.isAdmin && !!localStorage.getItem('authToken') && activeSection === 'orders',
    refetchInterval: false, // Disable automatic refetching to reduce API calls
    staleTime: 60000, // Consider data fresh for 1 minute
    retry: false, // Don't retry on failure to reduce errors
  });

  // Fetch products for admin
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: user?.isAdmin,
  });

  // Fetch orders with optimized polling
  const { data: orders = [], isLoading: ordersLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ['/api/admin/orders'],
    enabled: !!user?.isAdmin && !!localStorage.getItem('authToken') && activeSection === 'orders',
    refetchInterval: false, // Disable automatic refetching
    staleTime: 60000, // Consider data fresh for 1 minute
    retry: false, // Don't retry on failure
  });

  // Update order status mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status, trackingNumber }: { orderId: string; status: string; trackingNumber?: string }) => {
      const response = await apiRequest(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        body: { status, trackingNumber }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: "Order Updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    },
  });

    // Create product mutation
    const createProductMutation = useMutation({
      mutationFn: async (productData: Omit<Product, 'id'>) => {
        const response = await apiRequest('/api/products', {
          method: 'POST',
          body: productData
        });
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/products'] });
        setIsProductDialogOpen(false);
        toast({
          title: "Product Created",
          description: "Product has been created successfully.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to create product.",
          variant: "destructive",
        });
      },
    });

    // Update product mutation
    const updateProductMutation = useMutation({
      mutationFn: async ({ id, productData }: { id: string; productData: Partial<Product> }) => {
        // Clean the data before sending
        const cleanData = {
          ...productData,
          stock: productData.stock ? parseInt(productData.stock.toString()) : 0,
          price: productData.price?.toString(),
          weight: productData.weight?.toString(),
          thcaContent: productData.thcaContent?.toString() || null,
          rating: productData.rating?.toString() || null,
          effects: Array.isArray(productData.effects) ? productData.effects : []
        };

        // Remove undefined values
        Object.keys(cleanData).forEach(key => {
          if (cleanData[key as keyof typeof cleanData] === undefined) {
            delete cleanData[key as keyof typeof cleanData];
          }
        });

        return await apiRequest(`/api/products/${id}`, { method: 'PATCH', body: cleanData });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/products'] });
        setIsProductDialogOpen(false);
        setSelectedProduct(null);
        toast({
          title: "Product Updated",
          description: "Product has been updated successfully.",
        });
      },
      onError: (error: any) => {
        console.error('Update error:', error);
        toast({
          title: "Error",
          description: "Failed to update product. Please check the form data.",
          variant: "destructive",
        });
      },
    });

    // Delete product mutation
    const deleteProductMutation = useMutation({
      mutationFn: async (id: string) => {
        return await apiRequest(`/api/products/${id}`, { method: 'DELETE' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/products'] });
        setIsDeleteDialogOpen(false);
        toast({
          title: "Product Deleted",
          description: "Product has been deleted successfully.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete product.",
          variant: "destructive",
        });
      },
    });

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = orderSearch === '' || 
      order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.shippingName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.shippingEmail.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-glow-green-500/20 text-glow-green-300';
      case 'processing': return 'bg-hemp-500/20 text-hemp-400';
      case 'shipped': return 'bg-glow-green-600/20 text-glow-green-400';
      case 'delivered': return 'bg-glow-green-500/30 text-glow-green-300';
      case 'cancelled': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <AlertCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Order Status Dialog Component
  const OrderStatusDialog = ({ 
    order, 
    onUpdate, 
    isLoading 
  }: { 
    order: OrderWithDetails | null; 
    onUpdate: (status: string, trackingNumber?: string) => void;
    isLoading: boolean;
  }) => {
    const [status, setStatus] = useState(order?.status || 'pending');
    const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');

    useEffect(() => {
      if (order) {
        setStatus(order.status);
        setTrackingNumber(order.trackingNumber || '');
      }
    }, [order]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdate(status, trackingNumber || undefined);
    };

    if (!order) return null;

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="status" className="text-white font-semibold">Order Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-dark-800 border-gray-600 text-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-dark-800 border-gray-600">
              <SelectItem value="pending" className="text-white hover:bg-dark-700">Pending</SelectItem>
              <SelectItem value="processing" className="text-white hover:bg-dark-700">Processing</SelectItem>
              <SelectItem value="shipped" className="text-white hover:bg-dark-700">Shipped</SelectItem>
              <SelectItem value="delivered" className="text-white hover:bg-dark-700">Delivered</SelectItem>
              <SelectItem value="cancelled" className="text-white hover:bg-dark-700">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tracking" className="text-white font-semibold">Tracking Number (Optional)</Label>
          <Input
            id="tracking"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            className="border-gray-600 text-white placeholder:text-gray-400 focus:border-gold bg-[#000000]"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading} className="bg-gold text-black hover:bg-gold-600 font-semibold">
            {isLoading ? 'Updating...' : 'Update Order'}
          </Button>
        </div>
      </form>
    );
  };

  const ProductForm = ({ product, onSubmit, isLoading }: {
    product?: Product | null;
    onSubmit: (productData: Omit<Product, 'id'>) => void;
    isLoading: boolean;
  }) => {
    const [name, setName] = useState(product?.name || '');
    const [description, setDescription] = useState(product?.description || '');
    const [price, setPrice] = useState(product?.price || 0);
    const [stock, setStock] = useState(product?.stock || 0);
    const [category, setCategory] = useState(product?.category || '');
    const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({ 
        name, 
        description, 
        price: price.toString(), 
        stock, 
        category, 
        imageUrl,
        createdAt: null,
        weight: null,
        featured: null,
        rating: null,
        thcaContent: null,
        strainType: null,
        effects: null
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 text-[#000000]">
        <div>
          <Label htmlFor="name" className="text-white font-semibold">Product Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="border-gray-600 text-white placeholder:text-gray-400 focus:border-gold bg-[#000000]"
          />
        </div>
        <div>
          <Label htmlFor="description" className="text-white font-semibold">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            className="border-gray-600 text-white placeholder:text-gray-400 focus:border-gold bg-[#000000]"
          />
        </div>
        <div>
          <Label htmlFor="price" className="text-white font-semibold">Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Enter product price"
            className="border-gray-600 text-white placeholder:text-gray-400 focus:border-gold bg-[#000000]"
          />
        </div>
        <div>
          <Label htmlFor="stock" className="text-white font-semibold">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            placeholder="Enter product stock"
            className="border-gray-600 text-white placeholder:text-gray-400 focus:border-gold bg-[#000000]"
          />
        </div>
        <div>
          <Label htmlFor="category" className="text-white font-semibold">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter product category"
            className="border-gray-600 text-white placeholder:text-gray-400 focus:border-gold bg-[#000000]"
          />
        </div>
        <div>
          <Label htmlFor="imageUrl" className="text-white font-semibold">Image URL</Label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter product image URL"
            className="border-gray-600 text-white placeholder:text-gray-400 focus:border-gold bg-[#000000]"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading} className="bg-gold text-black hover:bg-gold-600 font-semibold">
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    );
  };

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
              <li>
                <Button
                  variant={activeSection === 'blog' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveSection('blog')}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Blog
                </Button>
              </li>
              <li>
                <Button
                  variant={activeSection === 'ai-deals' ? 'secondary' : 'ghost'}
                  className="w-full justify-start bg-green-600/20 hover:bg-green-600/30 text-green-400"
                  onClick={() => setActiveSection('ai-deals')}
                >
                  <DollarSign className="w-4 h-4 mr-3" />
                  AI Deals (19 Active)
                </Button>
              </li>
              <li>
                <Button
                  variant={activeSection === 'ai-seo' ? 'secondary' : 'ghost'}
                  className="w-full justify-start bg-purple-600/20 hover:bg-purple-600/30 text-purple-400"
                  onClick={() => setActiveSection('ai-seo')}
                >
                  <Search className="w-4 h-4 mr-3" />
                  AI SEO Enhancement
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
              {activeSection === 'blog' && 'Blog Management'}
              {activeSection === 'ai-deals' && 'AI Deals Generator'}
              {activeSection === 'ai-seo' && 'AI SEO Enhancement Center'}
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
                    <div className="w-12 h-12 bg-hemp/20 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-hemp" />
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
            <div className="space-y-6">
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Product Management</CardTitle>
                    <Button 
                      className="bg-gold text-black hover:bg-gold-600"
                      onClick={() => {
                        setSelectedProduct(null);
                        setIsProductDialogOpen(true);
                      }}
                    >
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
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setIsProductDialogOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => {
                                    setProductToDelete(product);
                                    setIsDeleteDialogOpen(true);
                                  }}
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

              {/* Product Edit/Create Dialog */}
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedProduct ? 'Edit Product' : 'Create New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <ProductForm
                    product={selectedProduct}
                    onSubmit={(productData) => {
                      if (selectedProduct) {
                        updateProductMutation.mutate({ id: selectedProduct.id, productData });
                      } else {
                        createProductMutation.mutate(productData);
                      }
                    }}
                    isLoading={createProductMutation.isPending || updateProductMutation.isPending}
                  />
                </DialogContent>
              </Dialog>

              {/* Product Delete Confirmation Dialog */}
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Product</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          if (productToDelete) {
                            deleteProductMutation.mutate(productToDelete.id);
                          }
                        }}
                        disabled={deleteProductMutation.isPending}
                      >
                        {deleteProductMutation.isPending ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Order Management Section */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Order Management
                  </CardTitle>
                  <div className="flex gap-4 mt-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search orders by ID, name, or email..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full" />
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No orders found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => (
                        <Card key={order.id} className="bg-dark-800/50 border-gray-700">
                          <CardContent className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                              {/* Order Info */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={getStatusColor(order.status)}>
                                    {getStatusIcon(order.status)}
                                    <span className="ml-1 capitalize">{order.status}</span>
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-400">Order #{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-gray-400">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                                <p className="font-semibold text-lg mt-2">${parseFloat(order.total).toFixed(2)}</p>
                              </div>

                              {/* Customer Info */}
                              <div>
                                <h4 className="font-semibold mb-2">Customer</h4>
                                <p className="text-sm">{order.shippingName}</p>
                                <p className="text-sm text-gray-400">{order.shippingEmail}</p>
                                {order.shippingPhone && (
                                  <p className="text-sm text-gray-400">{order.shippingPhone}</p>
                                )}
                              </div>

                              {/* Shipping Info */}
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  Shipping Address
                                </h4>
                                <div className="text-sm text-gray-400 space-y-1">
                                  <p>{order.shippingAddress}</p>
                                  {order.shippingAddress2 && <p>{order.shippingAddress2}</p>}
                                  <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                                  <p className="capitalize">
                                    <Truck className="w-3 h-3 inline mr-1" />
                                    {order.shippingMethod} shipping
                                  </p>
                                  {order.trackingNumber && (
                                    <p className="text-purple-400">
                                      Tracking: {order.trackingNumber}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedOrder(order)}
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Update Status
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Update Order Status</DialogTitle>
                                    </DialogHeader>
                                    <OrderStatusDialog
                                      order={selectedOrder}
                                      onUpdate={(status, trackingNumber) => {
                                        if (selectedOrder) {
                                          updateOrderMutation.mutate({
                                            orderId: selectedOrder.id,
                                            status,
                                            trackingNumber
                                          });
                                        }
                                      }}
                                      isLoading={updateOrderMutation.isPending}
                                    />
                                  </DialogContent>
                                </Dialog>

                                <div className="text-xs text-gray-500 space-y-1">
                                  <p>Subtotal: ${parseFloat(order.subtotal).toFixed(2)}</p>
                                  <p>Shipping: ${parseFloat(order.shippingCost).toFixed(2)}</p>
                                  <p>Tax: ${parseFloat(order.tax).toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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

          {activeSection === 'blog' && <BlogManagement blogFormData={blogFormData} />}
          
          {activeSection === 'ai-deals' && <AIDealsGenerator />}

          {/* AI SEO Enhancement Section */}
          {activeSection === 'ai-seo' && <AISEOManager />}
        </div>
      </div>

      {/* AI Chat Assistant for Admins */}
      <AIChat
        onProductUpdate={(productData) => {
          // Refresh products when AI creates/updates them
          queryClient.invalidateQueries({ queryKey: ['/api/products'] });
        }}
        onBlogCreation={(blogData) => {
          // Set blog form data and switch to blog section
          setBlogFormData(blogData);
          setActiveSection('blog');
        }}
        autoOpen={false}
      />
    </div>
  );
}