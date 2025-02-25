
import BasicLayout from '../../components/BasicLayot'
import Area from '../../components/Area'
import { RoutesAndUrls } from '../../RoutesAndUrls'

export const Contacts = () => {
    return (
        <BasicLayout title='Contacts' description='Manage your audience'>
            <div><Area title='asd'>sdfsd</Area>
            </div>
            <a href={RoutesAndUrls.USER.urlPath}>sdf</a>
        </BasicLayout>
    )
}
