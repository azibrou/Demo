import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AboutScreen } from './screens/AboutScreen'
import { HomeScreen } from './screens/HomeScreen'
import { SearchScreen } from './screens/SearchScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { RestaurantMerchantScreen } from './screens/RestaurantMerchantScreen'
import { StoreMerchantScreen } from './screens/StoreMerchantScreen'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeScreen />} />
          <Route path="about" element={<AboutScreen />} />
          <Route path="search" element={<SearchScreen />} />
          <Route path="store-merchant" element={<StoreMerchantScreen />} />
          <Route path="restaurant-merchant" element={<RestaurantMerchantScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
