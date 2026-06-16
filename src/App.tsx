import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomeShoppingStackLayout } from './components/HomeShoppingStackLayout'
import { Layout } from './components/Layout'
import { AboutScreen } from './screens/AboutScreen'
import { HomeScreen } from './screens/HomeScreen'
import { CategoryScreen } from './screens/CategoryScreen'
import { CheckoutScreen } from './screens/CheckoutScreen'
import { ShoppingListScreen } from './screens/ShoppingListScreen'
import { RestaurantMerchantScreen } from './screens/RestaurantMerchantScreen'
import { StoreMerchantScreen } from './screens/StoreMerchantScreen'
import { DineOutScreen } from './screens/DineOutScreen'
import { ProfilePhoneEditScreen } from './screens/ProfilePhoneEditScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { StoresScreen } from './screens/StoresScreen'
import { LoginScreen } from './screens/LoginScreen'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<HomeShoppingStackLayout />}>
          <Route index element={<HomeScreen />} />
          <Route path="stores" element={<StoresScreen />} />
          <Route path="dineout" element={<DineOutScreen />} />
          <Route path="category/:categoryId" element={<CategoryScreen />} />
          <Route path="checkout" element={<CheckoutScreen />} />
          <Route path="shopping-list" element={<ShoppingListScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="profile/edit-phone" element={<ProfilePhoneEditScreen />} />
          <Route path="store-merchant" element={<StoreMerchantScreen />} />
          <Route path="restaurant" element={<RestaurantMerchantScreen />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="about" element={<AboutScreen />} />
          <Route path="login" element={<LoginScreen />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
