import { View, Text } from '@react-pdf/renderer'
import { ResumePDFSection, ResumePDFText, ResumePDFLink } from './common'
import { styles, spacing } from './styles'
import type { ResumeProfile } from './types'

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
}: {
  profile: ResumeProfile
  themeColor: string
  isPDF: boolean
}) => {
  const { name, email, phone, url, summary, location } = profile

  return (
    <ResumePDFSection style={{ marginTop: spacing['4'] }}>
      <ResumePDFText
        bold={true}
        themeColor={themeColor}
        style={{ fontSize: '20pt' }}
      >
        {name}
      </ResumePDFText>
      {summary && <ResumePDFText>{summary}</ResumePDFText>}
      <View
        style={{
          ...styles.flexRowBetween,
          flexWrap: 'wrap',
          marginTop: spacing['0.5'],
        }}
      >
        {email && (
          <View
            style={{
              ...styles.flexRow,
              alignItems: 'center',
              gap: spacing['1'],
            }}
          >
            <Text style={{ fontSize: '10pt' }}>✉</Text>
            <ResumePDFLink src={`mailto:${email}`} isPDF={isPDF}>
              <ResumePDFText>{email}</ResumePDFText>
            </ResumePDFLink>
          </View>
        )}
        {phone && (
          <View
            style={{
              ...styles.flexRow,
              alignItems: 'center',
              gap: spacing['1'],
            }}
          >
            <Text style={{ fontSize: '10pt' }}>📞</Text>
            <ResumePDFLink src={`tel:${phone.replace(/[^\d+]/g, '')}`} isPDF={isPDF}>
              <ResumePDFText>{phone}</ResumePDFText>
            </ResumePDFLink>
          </View>
        )}
        {location && (
          <View
            style={{
              ...styles.flexRow,
              alignItems: 'center',
              gap: spacing['1'],
            }}
          >
            <Text style={{ fontSize: '10pt' }}>📍</Text>
            <ResumePDFText>{location}</ResumePDFText>
          </View>
        )}
        {url && (
          <View
            style={{
              ...styles.flexRow,
              alignItems: 'center',
              gap: spacing['1'],
            }}
          >
            <Text style={{ fontSize: '10pt' }}>🔗</Text>
            <ResumePDFLink
              src={url.startsWith('http') ? url : `https://${url}`}
              isPDF={isPDF}
            >
              <ResumePDFText>{url}</ResumePDFText>
            </ResumePDFLink>
          </View>
        )}
      </View>
    </ResumePDFSection>
  )
}
