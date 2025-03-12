import {
  Backdrop,
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import emailjs from '@emailjs/browser';
import { useToggle } from '@/hooks/common/useToggle';
import theme from '@/theme';

interface FormData {
  fullName: string;
  email: string;
  message: string;
}

const ModalUI = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 570,
  height: 'fit-content',
  bgcolor: 'transparent',
  overflow: 'hidden',
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
};

const InputsUI = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#191919',
    borderRadius: '12px',
    '& fieldset': {
      border: '0.5px solid #383736',
      borderRadius: '12px',
    },
    '&:hover fieldset': {
      borderColor: '#555555',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    color: '#fff',
    '&::placeholder': {
      color: '#ccc',
      opacity: 1,
    },
  },
  '& .MuiOutlinedInput-input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 100px #191919 inset',
    WebkitTextFillColor: '#fff',
  },
};

export function ContactModal() {
  const toggle = useToggle();
  const formRef = useRef(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (formRef.current) {
      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
          formRef.current,
          process.env.NEXT_PUBLIC_EMAILJS_USER_ID as string,
        )
        .then(() => {
          setSuccess(true);
          setLoading(false);
          setFormData({ fullName: '', email: '', message: '' });
        })
        .catch((err) => {
          console.error('Error sending email:', err);
          setError('Error al enviar el mensaje. Inténtalo de nuevo.');
          setLoading(false);
        });
    } else {
      setError('Formulario no disponible');
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    toggle.toggle();
    setSuccess(false);
    setError(null);
    setLoading(false);
    setFormData({ fullName: '', email: '', message: '' });
  };
  return (
    <>
      <Modal
        sx={ModalUI}
        open={toggle.state}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: '20px',
            overflow: 'hidden',
            bgcolor: '#08090B',
            border: '1px solid #191919',
            borderRadius: '20px',
          }}
        >
          <IconButton
            sx={{ ml: 'auto', color: '#fff' }}
            aria-label="close"
            onClick={handleModalClose}
          >
            <CloseIcon />
          </IconButton>
          <form ref={formRef} onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                p: '20px',
              }}
            >
              <span style={{ color: '#fff', fontSize: '24px' }}>
                Contact Protofire team
              </span>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <span>Full Name</span>
                <TextField
                  sx={InputsUI}
                  id="fullName"
                  variant="outlined"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <span>Email</span>
                <TextField
                  sx={InputsUI}
                  id="email"
                  variant="outlined"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <span>How can we help you?</span>
                <TextField
                  sx={InputsUI}
                  id="message"
                  variant="outlined"
                  placeholder="Message"
                  multiline
                  minRows={4}
                  maxRows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Box>
              {error && <Typography color="error">{error}</Typography>}
              {success && (
                <Typography color="success.main">
                  Message sent successfully!
                </Typography>
              )}

              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  sx={{
                    ml: 'auto',
                    borderRadius: '30px',
                    bgcolor: theme.palette.primary.main,
                  }}
                  variant="contained"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Modal>

      <Button
        sx={{
          color: '#EF801F',
          bgcolor: '#0D0D0D',
          border: '1px solid #3E3E3E',
          borderRadius: '4px',
          textTransform: 'uppercase',
          fontSize: '12px',
          py: 0,
          px: 0.5,
        }}
        onClick={() => toggle.toggle()}
      >
        Contact Protofire
      </Button>
    </>
  );
}
