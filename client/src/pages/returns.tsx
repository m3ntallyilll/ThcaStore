import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  RotateCcw, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  FileText,
  Camera,
  Mail,
  Phone,
  ArrowLeft,
  ShoppingBag,
  DollarSign,
  Calendar,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ReturnRequest {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  returnType: 'refund' | 'exchange' | 'store_credit';
  createdAt: string;
  updatedAt: string;
  refundAmount?: number;
  trackingNumber?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
  }>;
}

const returnReasons = [
  { value: 'defective', label: 'Defective Product', description: 'Product arrived damaged or not working' },
  { value: 'quality', label: 'Quality Issues', description: 'Product quality below expectations' },
  { value: 'wrong_item', label: 'Wrong Item', description: 'Received different product than ordered' },
  { value: 'not_as_described', label: 'Not as Described', description: 'Product differs from website description' },
  { value: 'changed_mind', label: 'Changed Mind', description: 'No longer want the product' },
  { value: 'allergic_reaction', label: 'Allergic Reaction', description: 'Product caused adverse reaction' },
  { value: 'potency_issue', label: 'Potency Issue', description: 'Product potency not as advertised' },
  { value: 'other', label: 'Other', description: 'Other reason not listed above' }
];

export default function Returns() {
  const [step, setStep] = useState<'select_order' | 'select_items' | 'return_form' | 'confirmation'>('select_order');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [returnForm, setReturnForm] = useState({
    reason: '',
    returnType: 'refund',
    description: '',
    images: [] as File[]
  });
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    enabled: !!user
  });

  // Fetch return requests
  const { data: returnRequests = [], isLoading: returnsLoading } = useQuery<ReturnRequest[]>({
    queryKey: ['/api/returns'],
    enabled: !!user
  });

  // Create return request mutation
  const createReturnMutation = useMutation({
    mutationFn: async (returnData: any) => {
      return apiRequest('/api/returns', {
        method: 'POST',
        body: returnData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/returns'] });
      setStep('confirmation');
      toast({
        title: "Return Request Submitted",
        description: "We'll review your return request and contact you within 24 hours."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit return request",
        variant: "destructive"
      });
    }
  });

  const handleSubmitReturn = () => {
    if (!selectedOrder || selectedItems.length === 0) return;

    const returnData = {
      orderId: selectedOrder.id,
      items: selectedItems.map(itemId => {
        const item = selectedOrder.items.find(i => i.id === itemId);
        return {
          productId: item?.productId,
          quantity: item?.quantity,
          reason: returnForm.reason,
          description: returnForm.description,
          returnType: returnForm.returnType
        };
      })
    };

    createReturnMutation.mutate(returnData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'approved': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'rejected': return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'processing': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'completed': return 'text-green-400 border-green-500/30 bg-green-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      case 'processing': return <RefreshCw className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <Card className="glass-dark border-gray-700 max-w-md">
          <CardContent className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-300 mb-6">Please log in to access returns and refunds.</p>
            <Button>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Returns & Refunds
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Returns and refunds are available for insured orders only. Protect your purchase with shipping insurance during checkout.
          </p>
        </motion.div>

        {/* Return Policy Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-dark border-yellow-500/30 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Important: Insurance Required for Returns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-yellow-400 mb-2">Insurance Policy Notice</h3>
                  <p className="text-gray-300 text-sm">
                    <strong>Returns and refunds are only available for orders that include shipping insurance.</strong> 
                    This policy protects both you and our business from losses during transit of hemp-derived THCA products.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Insurance Required</h3>
                  <p className="text-gray-300 text-sm">Only insured orders are eligible for returns</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">30-Day Window</h3>
                  <p className="text-gray-300 text-sm">Returns accepted within 30 days of delivery</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Original Packaging</h3>
                  <p className="text-gray-300 text-sm">Items must be in original, unopened packaging</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Return Process */}
          <div className="lg:col-span-2">
            {step === 'select_order' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="glass-dark border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Select Order to Return
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-20 bg-gray-700/50 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                        <p className="text-gray-300">You haven't placed any orders yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => {
                          // Check if order has shipping insurance (mock check - in production, check order.hasInsurance)
                          const hasInsurance = Math.random() > 0.3; // Mock 70% of orders have insurance
                          const isEligible = hasInsurance && order.status === 'delivered';
                          
                          return (
                            <div
                              key={order.id}
                              className={`p-4 border rounded-lg transition-colors ${
                                isEligible 
                                  ? 'border-gray-700 hover:border-blue-500/50 cursor-pointer' 
                                  : 'border-red-500/30 bg-red-500/5 cursor-not-allowed opacity-70'
                              }`}
                              onClick={() => {
                                if (isEligible) {
                                  setSelectedOrder(order);
                                  setStep('select_items');
                                } else {
                                  toast({
                                    title: "Return Not Available",
                                    description: hasInsurance 
                                      ? "Order must be delivered to be eligible for returns"
                                      : "This order was not insured and is not eligible for returns",
                                    variant: "destructive"
                                  });
                                }
                              }}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-white">Order #{order.orderNumber}</h3>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-gray-300">
                                    {order.status}
                                  </Badge>
                                  {hasInsurance ? (
                                    <Badge variant="outline" className="text-green-400 border-green-500/30 bg-green-500/10">
                                      Insured
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-red-400 border-red-500/30 bg-red-500/10">
                                      Not Insured
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-300">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-green-400 font-semibold">
                                  ${order.total.toFixed(2)}
                                </span>
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                <span className="text-sm text-gray-400">
                                  {order.items.length} item(s)
                                </span>
                                {!isEligible && (
                                  <span className="text-xs text-red-400">
                                    {!hasInsurance ? 'Insurance required for returns' : 'Order not delivered'}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'select_items' && selectedOrder && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="glass-dark border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Select Items to Return
                      </CardTitle>
                      <Button
                        variant="outline"
                        onClick={() => setStep('select_order')}
                        className="text-gray-300"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedItems.includes(item.id)
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                          onClick={() => {
                            setSelectedItems(prev =>
                              prev.includes(item.id)
                                ? prev.filter(id => id !== item.id)
                                : [...prev, item.id]
                            );
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.productImage || '/placeholder-product.jpg'}
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{item.productName}</h4>
                              <p className="text-gray-300">Quantity: {item.quantity}</p>
                              <p className="text-green-400 font-semibold">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={() => setStep('return_form')}
                        disabled={selectedItems.length === 0}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Continue with {selectedItems.length} item(s)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'return_form' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="glass-dark border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Return Details
                      </CardTitle>
                      <Button
                        variant="outline"
                        onClick={() => setStep('select_items')}
                        className="text-gray-300"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-white mb-3 block">Return Type</Label>
                      <Select value={returnForm.returnType} onValueChange={(value) => setReturnForm(prev => ({ ...prev, returnType: value }))}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="refund">Full Refund</SelectItem>
                          <SelectItem value="exchange">Product Exchange</SelectItem>
                          <SelectItem value="store_credit">Store Credit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white mb-3 block">Reason for Return</Label>
                      <Select value={returnForm.reason} onValueChange={(value) => setReturnForm(prev => ({ ...prev, reason: value }))}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {returnReasons.map((reason) => (
                            <SelectItem key={reason.value} value={reason.value}>
                              <div>
                                <div className="font-medium">{reason.label}</div>
                                <div className="text-sm text-gray-400">{reason.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white mb-3 block">Additional Details</Label>
                      <Textarea
                        placeholder="Please provide additional details about your return..."
                        value={returnForm.description}
                        onChange={(e) => setReturnForm(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label className="text-white mb-3 block flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Photos (Optional)
                      </Label>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">
                          Upload photos to help us process your return faster
                        </p>
                        <Button variant="outline" className="mt-3">
                          Choose Files
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleSubmitReturn}
                        disabled={!returnForm.reason || createReturnMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {createReturnMutation.isPending ? 'Submitting...' : 'Submit Return Request'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'confirmation' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="glass-dark border-green-500/30 bg-green-500/5">
                  <CardContent className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">Return Request Submitted!</h2>
                    <p className="text-gray-300 mb-6">
                      We've received your return request and will review it within 24 hours. 
                      You'll receive an email with further instructions.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={() => {
                          setStep('select_order');
                          setSelectedOrder(null);
                          setSelectedItems([]);
                          setReturnForm({ reason: '', returnType: 'refund', description: '', images: [] });
                        }}
                        variant="outline"
                      >
                        Submit Another Return
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700">
                        View My Returns
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Return Requests */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <RotateCcw className="w-5 h-5" />
                    My Return Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {returnsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-700/50 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : returnRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-300 text-sm">No return requests yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {returnRequests.slice(0, 5).map((request) => (
                        <div key={request.id} className="p-3 border border-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1 capitalize">{request.status}</span>
                            </Badge>
                          </div>
                          <h4 className="text-white text-sm font-medium">{request.productName}</h4>
                          <p className="text-gray-400 text-xs">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Need Help?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">
                    Questions about insurance or returns? Our team can help explain your options.
                  </p>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      returns@thcastore.com
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      (555) 123-THCA
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Hours: Mon-Fri 9AM-6PM PST
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}