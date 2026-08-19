import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaArrowRight, FaUsers } from 'react-icons/fa';
import {
  preguntasLiderazgo,
  dimensionesLiderazgo,
  clasificarNivelLiderazgo,
  obtenerPerfilLiderazgo,
  perfilesLiderazgo
} from '../../utils/constants';
import api from '../../services/api';
import './TestLiderazgoContainer.css';

const TestLiderazgoContainer = ({ setUserData, userData }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [userInfo, setUserInfo] = useState({
    nombre: userData?.nombre || '',
    email: userData?.email || '',
    edad: ''
  });
  const [respuestas, setRespuestas] = useState({});
  const [resultados, setResultados] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalDimensiones = dimensionesLiderazgo.length;
  const dimensionActual = dimensionesLiderazgo[currentDimensionIndex];
  const preguntasDimension = dimensionActual?.preguntas.map(idx => preguntasLiderazgo[idx]) || [];

  useEffect(() => {
    const inicial = {};
    preguntasLiderazgo.forEach((_, index) => {
      inicial[index] = null;
    });
    setRespuestas(inicial);
  }, []);

  const handleUserInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleRespuesta = (index, value) => {
    setRespuestas(prev => ({ ...prev, [index]: parseInt(value) }));
  };

  const calcularResultados = () => {
    const puntajes = {};
    dimensionesLiderazgo.forEach(dim => {
      let sum = 0;
      dim.preguntas.forEach(idx => {
        sum += respuestas[idx] || 0;
      });
      puntajes[dim.id] = sum;
    });

    const total = Object.values(puntajes).reduce((a, b) => a + b, 0);
    const perfil = obtenerPerfilLiderazgo(puntajes);
    const descripcion = perfilesLiderazgo[perfil] || 'Perfil no definido';

    return {
      dimensiones: puntajes,
      puntajeTotal: total,
      perfil,
      descripcion,
      detalle: dimensionesLiderazgo.map(dim => ({
        id: dim.id,
        label: dim.label,
        icon: dim.icon,
        color: dim.color,
        puntaje: puntajes[dim.id],
        nivel: clasificarNivelLiderazgo(puntajes[dim.id])
      }))
    };
  };

  const handleEnviarResultados = async () => {
    if (!userInfo.nombre || !userInfo.email || !userInfo.edad) {
      toast.error('Por favor completa todos tus datos');
      return;
    }

    const todasRespondidas = Object.values(respuestas).every(v => v !== null);
    if (!todasRespondidas) {
      toast.error('Responde todas las preguntas para obtener un perfil válido');
      return;
    }

    setIsLoading(true);
    const resultadosCalculados = calcularResultados();

    try {
      const data = {
        nombre: userInfo.nombre.trim(),
        email: userInfo.email.trim(),
        edad: parseInt(userInfo.edad),
        tipoTest: 'liderazgo',
        resultados: {
          dimensiones: resultadosCalculados.dimensiones,
          puntajeTotal: resultadosCalculados.puntajeTotal,
          perfil: resultadosCalculados.perfil,
          descripcion: resultadosCalculados.descripcion,
          detalle: resultadosCalculados.detalle
        }
      };

      const response = await api.guardarResultado(data);
      if (response.success || response.warning) {
        setUserData({ nombre: userInfo.nombre, email: userInfo.email });
        localStorage.setItem('gokulab_user', JSON.stringify({
          nombre: userInfo.nombre,
          email: userInfo.email
        }));
        setResultados(resultadosCalculados);
        setCurrentStep(2);
        toast.success('¡Resultados guardados exitosamente!');
      }
    } catch (error) {
      toast.error('Error al guardar los resultados');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizado de pasos...
  // (mantén el resto del código que te proporcioné antes, 
  // pero asegúrate de que esté completo)
};

export default TestLiderazgoContainer;