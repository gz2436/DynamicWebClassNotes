import { View } from '@react-pdf/renderer'
import { ResumePDFSection, ResumePDFText, ResumePDFBulletList } from './common'
import { styles, spacing } from './styles'
import type { ResumeEducation } from './types'

export const ResumePDFEducation = ({
  heading,
  educations,
  themeColor,
  showBulletPoints = true,
}: {
  heading: string
  educations: ResumeEducation[]
  themeColor: string
  showBulletPoints?: boolean
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {educations.map(({ school, degree, date, gpa, descriptions }, idx) => (
        <View key={idx}>
          <View style={{ ...styles.flexRowBetween, marginTop: spacing['0.5'] }}>
            <ResumePDFText bold={true}>{school}</ResumePDFText>
            <ResumePDFText>{date}</ResumePDFText>
          </View>
          <View style={{ ...styles.flexRowBetween }}>
            <ResumePDFText>{degree}</ResumePDFText>
            {gpa && <ResumePDFText>GPA: {gpa}</ResumePDFText>}
          </View>
          {descriptions.length > 0 && (
            <View style={{ ...styles.flexCol, marginTop: spacing['1.5'] }}>
              <ResumePDFBulletList
                items={descriptions}
                showBulletPoints={showBulletPoints}
              />
            </View>
          )}
        </View>
      ))}
    </ResumePDFSection>
  )
}
