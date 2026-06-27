import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Hero from './components/home/Hero';
import TestCards from './components/home/TestCards';
import Test1Container from './components/test1/Test1Container';
import Test2Container from './components/test2/Test2Container';
import AdminPanel from './components/admin/AdminPanel';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('gokulab_user');
    if (savedData) {
      try {
        setUserData(JSON.parse(savedData));
      } catch (e) {
        localStorage.removeItem('gokulab_user');
      }
    }
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <>
      <Helmet>
        <title>GŌKU LAB - Plataforma de Evaluación</title>
        <meta name="description" content="Descubre tus talentos y potencia tu espíritu emprendedor con GŌKU LAB" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="app">
        <Header userData={userData} setUserData={setUserData} />
        
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <motion.div
                  key="home"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                >
                  <Hero />
                  <TestCards />
                </motion.div>
              } />
              <Route path="/test/inteligencias" element={
                <motion.div
                  key="test1"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                >
                  <Test1Container setUserData={setUserData} userData={userData} />
                </motion.div>
              } />
              <Route path="/test/emprendedor" element={
                <motion.div
                  key="test2"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                >
                  <Test2Container setUserData={setUserData} userData={userData} />
                </motion.div>
              } />
              <Route path="/admin" element={
                <motion.div
                  key="admin"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                >
                  <AdminPanel />
                </motion.div>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;