import { Box, Paper, TextField, Button, Typography, Checkbox, FormControlLabel, IconButton, InputAdornment } from '@mui/material';
import { useAuth } from '../AuthContext';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../routes/paths';

export default function Login() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('gustavo.dias@gmail.com');
  const [password, setPassword] = useState('******');
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password, remember);
    nav(paths.root);
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, minHeight: '100vh' }}>
      <Box sx={{ display: 'grid', placeItems: 'center', p: 4 }}>
        <Paper sx={{ p: 4, width: 420, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>DRIVEON</Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="Endereço de e-mail" fullWidth value={email} onChange={e=>setEmail(e.target.value)} sx={{ mb: 2 }} />
            <TextField
              label="Senha"
              fullWidth
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e=>setPassword(e.target.value)}
              sx={{ mb: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShow(s=>!s)}>{show ? <VisibilityOff/> : <Visibility/>}</IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel control={<Checkbox checked={remember} onChange={e=>setRemember(e.target.checked)} />} label="Lembrar-me" />
              <Button variant="text">Esqueceu sua senha?</Button>
            </Box>
            <Button type="submit" variant="contained" fullWidth size="large">Entrar</Button>
          </form>
        </Paper>
      </Box>

      {/* lado direito: imagem ilustrativa */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, background: 'url(/mechanic.jpg) center/cover no-repeat' }} />
    </Box>
  );
}
