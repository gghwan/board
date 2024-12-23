import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Sidebar from './components/layout/Sidebar'
import Home from './pages/Home'
import PostCreate from './pages/PostCreate'
import PostDetail from './pages/PostDetail'
import PostEdit from './pages/PostEdit'
import PostList from './components/post/PostList'
import './App.css'
import { EditorProvider } from './components/editor/core/contexts/EditorContext'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          rel="stylesheet"
        />
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              <div className="w-64 flex-shrink-0">
                <Sidebar />
              </div>
              <div className="flex-1 text-left">
                <EditorProvider>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/posts/new" element={<PostCreate />} />
                    <Route path="/posts" element={<PostList />} />
                    <Route path="/posts/:id" element={<PostDetail />} />
                    <Route path="/posts/:id/edit" element={<PostEdit />} />
                    <Route path="/latest" element={<div>최신 글</div>} />
                    <Route path="/popular" element={<div>인기 글</div>} />
                    <Route path="/categories" element={<div>카테고리</div>} />
                    <Route path="/members" element={<div>회원목록</div>} />
                    <Route path="/login" element={<div>로그인</div>} />
                  </Routes>
                </EditorProvider>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App