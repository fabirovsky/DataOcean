import React from 'react';
import { ReactRouterPropTypes } from 'utils/prop-types';
import {
  Mail, Settings, User,
} from 'react-feather';
import { NavLink, Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileSettings from './ProfileSettings';
import ProfileInfo from './ProfileInfo';

const ProfilePage = ({ match }) => {
  const user = useSelector((store) => store.user);
  return (
    <>
      <div className="intro-y flex items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">
          Профіль
        </h2>
      </div>
      <div className="intro-y box px-5 pt-5 mt-5">
        <div className="flex flex-col lg:flex-row border-b border-gray-200 pb-5 -mx-5">
          <div className="flex flex-1 px-5 items-center justify-center lg:justify-start">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative">
              <div className="rounded-full overflow-hidden shadow-lg">
                <User width="100%" height="100%" />
              </div>
            </div>
            <div className="ml-5">
              <div className="sm:w-40 truncate sm:whitespace-normal font-medium text-lg">
                {user.first_name} {user.last_name}
              </div>
              {user.organization && <div className="text-gray-600">{user.organization}</div>}
              {user.position && <div className="text-gray-600">{user.position}</div>}
            </div>
          </div>
          <div
            className={
              'flex mt-6 lg:mt-0 items-center lg:items-start flex-1 flex-col justify-center ' +
              'text-gray-600 px-5 border-l border-r border-gray-200 border-t lg:border-t-0 pt-5 lg:pt-0'
            }
          >
            <div className="truncate sm:whitespace-normal flex items-center">
              <Mail className="w-4 h-4 mr-2" /> {user.email}
            </div>
          </div>
          <div
            className={
              'mt-6 lg:mt-0 flex-1 flex items-center justify-center px-5 ' +
              'border-t lg:border-0 border-gray-200 pt-5 lg:pt-0'
            }
          >
            <div className="text-center rounded-md w-20 py-3">
              <div className="font-semibold text-theme-1 text-lg">150</div>
              <div className="text-gray-600">Ендпоінти</div>
            </div>
            <div className="text-center rounded-md w-20 py-3">
              <div className="font-semibold text-theme-1 text-lg">1 k</div>
              <div className="text-gray-600">Запити</div>
            </div>
            <div className="text-center rounded-md w-20 py-3">
              <div className="font-semibold text-theme-1 text-lg">63</div>
              <div className="text-gray-600">Звіти</div>
            </div>
          </div>
        </div>
        <div className="nav-tabs flex flex-col sm:flex-row justify-center lg:justify-start">
          <NavLink
            exact
            to="/system/profile/"
            data-toggle="tab"
            className="py-4 sm:mr-8 flex items-center"
            activeClassName="active"
          >
            <User className="w-4 h-4 mr-2" /> Профіль
          </NavLink>
          <NavLink
            exact
            to="/system/profile/settings/"
            data-toggle="tab"
            className="py-4 sm:mr-8 flex items-center"
            activeClassName="active"
          >
            <Settings className="w-4 h-4 mr-2" /> Налаштування
          </NavLink>
        </div>
      </div>
      <Switch>
        <Route
          exact
          path={`${match.path}settings/`}
          component={ProfileSettings}
        />
        <Route
          exact
          path={`${match.path}/`}
          component={ProfileInfo}
        />
      </Switch>
    </>
  );
};

ProfilePage.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default ProfilePage;
