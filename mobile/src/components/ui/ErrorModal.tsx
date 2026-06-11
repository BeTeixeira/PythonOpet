import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText } from './AppText';
import { Button } from './Button';

interface ErrorModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onDismiss: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  visible,
  title = 'Atenção',
  message,
  onDismiss,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    statusBarTranslucent
    onRequestClose={onDismiss}
  >
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onDismiss}>
      {/* Inner touchable prevents tap-through to the overlay closing logic */}
      <TouchableOpacity activeOpacity={1} style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="alert-circle" size={36} color={Colors.error} />
        </View>
        <AppText variant="h3" style={styles.title}>
          {title}
        </AppText>
        <AppText variant="body" color="secondary" style={styles.message}>
          {message}
        </AppText>
        <Button label="Entendi" onPress={onDismiss} fullWidth />
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: '#1A1A22',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.errorSoft,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.errorSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
});
