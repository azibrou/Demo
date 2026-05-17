import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomeShoppingStackLayout } from './components/HomeShoppingStackLayout'
import { Layout } from './components/Layout'
import { AboutScreen } from './screens/AboutScreen'
import { HomeScreen } from './screens/HomeScreen'
import { ShoppingListScreen } from './screens/ShoppingListScreen'
import { StoresScreen } from './screens/StoresScreen'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<HomeShoppingStackLayout />}>
          <Route index element={<HomeScreen />} />
          <Route path="stores" element={<StoresScreen />} />
          <Route path="shopping-list" element={<ShoppingListScreen />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="about" element={<AboutScreen />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
