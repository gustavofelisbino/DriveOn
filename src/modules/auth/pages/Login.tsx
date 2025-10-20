import { Box, Paper, TextField, Button, Typography, Checkbox, FormControlLabel, IconButton, InputAdornment, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../routes/paths';
import logo from '../../../assets/logo.png';
import mechanic from '../../../assets/mechanic.png';

export default function Login() {
  const nav = useNavigate();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('gustavo.dias@gmail.com');
  const [password, setPassword] = useState('123456');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verifica se já está autenticado usando as mesmas chaves do AuthContext
    const token = localStorage.getItem('driveon:token') ?? sessionStorage.getItem('driveon:token');
    console.log('useEffect - token:', token);
    if (token) {
      console.log('Já autenticado, tentando navegar...');
      nav(paths.root, { replace: true });
    }
  }, [nav]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    console.log('Submit iniciado');
    console.log('paths.root:', paths.root);
    
    // Validação básica local
    if (!email || !password) {
      setError('Preencha o e-mail e a senha.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    // Cria um usuário e token mock
    const mockToken = 'mock-token-' + Date.now();
    const mockUser = {
      usuarioId: 1,
      nome: email.split('@')[0],
      cargo: 'Usuário',
      empresaId: 1
    };

    // Armazena nos mesmos formatos que o AuthContext espera
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('driveon:token', mockToken);
    storage.setItem('driveon:user', JSON.stringify(mockUser));
    
    console.log('Dados salvos no storage');
    console.log('Navegando para:', paths.root);
    
    setLoading(false);
    
    // Força reload da página para recarregar o contexto
    window.location.href = paths.root;
  };

  const fieldSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': { borderRadius: 1, height: 48, width: '100%' },
    '& .MuiInputLabel-root': { fontSize: 12, fontWeight: 500, color: 'text.primary' },
  } as const;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 2.5, md: 8 } }}>
        <Paper elevation={0} sx={{ width: '100%', maxWidth: 520, bgcolor: 'transparent' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img src={logo} alt="Logo da empresa" width={180} style={{ display: 'inline-block' }} />
          </Box>

          <form onSubmit={handleSubmit} noValidate>
            <TextField 
              label="Endereço de e-mail" 
              fullWidth 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              sx={fieldSx} 
              autoComplete="email" 
            />
            <TextField
              label="Senha" 
              fullWidth 
              type={show ? 'text' : 'password'} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              sx={{ ...fieldSx, mb: 1.5 }} 
              autoComplete="current-password"
              InputProps={{ 
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShow(s => !s)} edge="end">
                      {show ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                ) 
              }}
            />

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <FormControlLabel 
                control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />} 
                label="Lembrar-me" 
              />
              <Button variant="text" sx={{ textTransform: 'none', p: 0, minWidth: 0 }}>
                Esqueceu sua senha?
              </Button>
            </Stack>

            {error && <Typography color="error" variant="body2" sx={{ mb: 1 }}>{error}</Typography>}

            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              size="medium" 
              disabled={loading} 
              sx={{ height: 50, borderRadius: 2, fontWeight: 700 }}
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>
        </Paper>
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative', borderLeft: (t) => `1px solid ${t.palette.divider}`, overflow: 'hidden' }}>
        <Box 
          component="img" 
          src={mechanic} 
          alt="Mecânico usando celular" 
          sx={{ width: '100%', height: '100vh', objectFit: 'cover', objectPosition: 'initial', display: 'block' }} 
        />
      </Box>
    </Box>
  );
}