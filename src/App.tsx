import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomeShoppingStackLayout } from './components/HomeShoppingStackLayout'
import { Layout } from './components/Layout'
import { AboutScreen } from './screens/AboutScreen'
import { HomeScreen } from './screens/HomeScreen'
import { ShoppingListScreen } from './screens/ShoppingListScreen'
import { RestaurantMerchantScreen } from './screens/RestaurantMerchantScreen'
import { StoreMerchantScreen } from './screens/StoreMerchantScreen'
import { DineOutScreen } from './screens/DineOutScreen'
import { StoresScreen } from './screens/StoresScreen'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<HomeShoppingStackLayout />}>
          <Route index element={<HomeScreen />} />
          <Route path="stores" element={<StoresScreen />} />
          <Route path="dineout" element={<DineOutScreen />} />
          <Route path="shopping-list" element={<ShoppingListScreen />} />
          <Route path="store-merchant" element={<StoreMerchantScreen />} />
          <Route path="restaurant" element={<RestaurantMerchantScreen />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="about" element={<AboutScreen />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
