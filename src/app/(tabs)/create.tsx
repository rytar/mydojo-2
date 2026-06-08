import { FileCheck2, ShieldAlert, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Screen } from '@/components/mydojo/layout';
import { Card, DojoButton, Pill, SectionHeader } from '@/components/mydojo/primitives';
import { BodyText, DisplayText, LabelText } from '@/components/mydojo/typography';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { submitProgramDraft } from '@/services/creator-programs';

const domains = ['Force', 'Nutrition', 'Mobilité', 'Mindset'];
const difficulties = ['Débutant', 'Intermédiaire', 'Avancé'];

export default function CreateScreen() {
  const [title, setTitle] = useState('Samurai Strength');
  const [description, setDescription] = useState(
    'Un cycle de force minimaliste, progressif et lisible pour installer une vraie discipline.',
  );
  const [domain, setDomain] = useState('Force');
  const [difficulty, setDifficulty] = useState('Débutant');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    try {
      await submitProgramDraft({
        title,
        domain,
        difficulty,
        description,
      });
      setSubmitted(true);
    } catch {
      setSubmitError('Impossible de soumettre le protocole pour le moment.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <View>
        <LabelText color={Palette.oxblood}>Studio créateur</LabelText>
        <DisplayText style={styles.title}>Créer un protocole</DisplayText>
        <BodyText color={Palette.muted}>
          Tout le monde peut proposer un programme. La visibilité dépendra du rang, des avis, de la
          complétion et des signaux qualité.
        </BodyText>
      </View>

      <Card style={styles.formCard}>
        <LabelText>Nom du programme</LabelText>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={Palette.faint}
          style={styles.textInput}
        />

        <LabelText>Domaine</LabelText>
        <View style={styles.pillRow}>
          {domains.map((item) => (
            <Pill key={item} active={domain === item} onPress={() => setDomain(item)}>
              {item}
            </Pill>
          ))}
        </View>

        <LabelText>Niveau</LabelText>
        <View style={styles.pillRow}>
          {difficulties.map((item) => (
            <Pill key={item} active={difficulty === item} onPress={() => setDifficulty(item)}>
              {item}
            </Pill>
          ))}
        </View>

        <LabelText>Description courte</LabelText>
        <TextInput
          multiline
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={Palette.faint}
          style={[styles.textInput, styles.textArea]}
        />
      </Card>

      <SectionHeader title="Structure" action="4 modules" />
      <View style={styles.moduleList}>
        {['Fondations', 'Progression', 'Tests', 'Récupération'].map((module, index) => (
          <Card key={module} style={styles.moduleCard}>
            <View style={styles.moduleNumber}>
              <LabelText color={Palette.paperSoft}>{index + 1}</LabelText>
            </View>
            <View style={{ flex: 1 }}>
              <BodyText style={styles.moduleTitle}>{module}</BodyText>
              <BodyText color={Palette.muted}>Séances, consignes et repères à compléter.</BodyText>
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.moderationCard}>
        <View style={styles.modHeader}>
          <ShieldAlert color={Palette.oxblood} size={28} />
          <View style={{ flex: 1 }}>
            <LabelText color={Palette.oxblood}>Publication filtrée</LabelText>
            <BodyText>Le programme part en contrôle minimal avant visibilité publique.</BodyText>
          </View>
        </View>
        {[
          'Pas de promesse médicale',
          'Objectif, durée et niveau obligatoires',
          'Signalement possible après publication',
        ].map((rule) => (
          <View key={rule} style={styles.ruleRow}>
            <FileCheck2 color={Palette.success} size={18} />
            <BodyText>{rule}</BodyText>
          </View>
        ))}
      </Card>

      <DojoButton icon={submitted ? 'check' : 'arrow'} onPress={handleSubmit}>
        {submitted ? 'Soumis pour revue' : submitting ? 'Soumission...' : 'Soumettre le protocole'}
      </DojoButton>

      {submitError && (
        <View style={styles.errorBox}>
          <BodyText color={Palette.oxblood}>{submitError}</BodyText>
        </View>
      )}

      {submitted && (
        <View style={styles.successBox}>
          <Sparkles color={Palette.gold} size={20} />
          <BodyText style={{ flex: 1 }}>
            Brouillon soumis. Statut MVP : contrôle minimal puis classement algorithmique.
          </BodyText>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 48,
    lineHeight: 49,
  },
  formCard: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  textInput: {
    minHeight: 48,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Palette.line,
    paddingHorizontal: Spacing.three,
    color: Palette.ink,
    backgroundColor: 'rgba(255,253,247,0.62)',
    fontSize: 15,
  },
  textArea: {
    minHeight: 110,
    paddingTop: Spacing.two,
    textAlignVertical: 'top',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  moduleList: {
    gap: Spacing.two,
  },
  moduleCard: {
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  moduleNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleTitle: {
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  moderationCard: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  modHeader: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  successBox: {
    borderRadius: Radius.md,
    backgroundColor: 'rgba(185,144,74,0.16)',
    borderWidth: 1,
    borderColor: Palette.goldSoft,
    padding: Spacing.three,
    flexDirection: 'row',
    gap: Spacing.two,
  },
  errorBox: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.oxblood,
    backgroundColor: 'rgba(154,46,38,0.08)',
    padding: Spacing.three,
  },
});
