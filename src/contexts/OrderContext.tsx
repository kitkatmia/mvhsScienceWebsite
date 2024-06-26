import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// TO-DO: need to alter context in ordercard and recivie it in form

interface OrderContextType {
  sharedState: string[];
  setSharedState: Dispatch<SetStateAction<string[]>>;
}

// const OrderContext = createContext<OrderContextType>({"", null});
const OrderContext = createContext<OrderContextType>({
  sharedState: [], 
  setSharedState: () => {/* no-op */} 
});

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [sharedState, setSharedState] = useState<string[]>([]);

  return (
    <OrderContext.Provider value={{ sharedState, setSharedState }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (context === null) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};

// below doesn't work because of type issues
// const OrderContext = createContext(Object || null);

// export const OrderProvider = ({props}: {props: any}) => {
//   const [sharedState, setSharedState] = useState<null | { [key: string]: any }>(null);
//   return (
//     <OrderContext.Provider value={{ sharedState, setSharedState }}>
//       {props}
//     </OrderContext.Provider>
//   );
// };