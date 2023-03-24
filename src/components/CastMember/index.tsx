import { ICastMember } from '../../types';
import './style.scss';
export function CastMember({ member }: { member: ICastMember }): JSX.Element {
  console.log(member);

  return (
    <div className="cast-member">
      <div className="cast-member-image">
        <img
          width={200}
          src={
            member.person?.image?.medium ||
            'https://github.blog/jp/wp-content/uploads/sites/2/2023/03/Blog-Unfurl-Social-Card_LightMod.png?resize=150%2C150'
          }
          alt=""
        />
      </div>
      <ul>
        <li>
          <strong>{member.person.name}</strong>
        </li>
        <li> {member.character.name}</li>
      </ul>
    </div>
  );
}
