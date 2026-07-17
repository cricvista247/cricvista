export const SubscriptionData = (data: any) => {
  const a = {
    name: data.name,
    price: Number(data.price),
    credits: Number(data.credits),
    description: data.description,
    features: data.features,
    popular: data.popular,
    icon: data.icon,
    color: data.color,
    bgColor: data.bgColor,
    borderColor: data.borderColor,
    isActive: data.isActive,
    type: data.type,
  };

  return a;
};
