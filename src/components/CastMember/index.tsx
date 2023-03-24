import { ICastMember } from '../../types';

export function CastMember({ member }: { member: ICastMember }): JSX.Element {
  return (
    <div className="cast-member">
      <div className="cast-member-image">{member.person.image && <img src={member.person.image.medium} alt="" />}</div>
      <strong>{member.person.name}</strong>&nbsp;as&nbsp;
      {member.character.name}
    </div>
  );
}
